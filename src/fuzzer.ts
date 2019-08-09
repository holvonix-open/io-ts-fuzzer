import * as t from 'io-ts';
import { Registry } from './registry';

export interface FuzzContext {
  /**
   * context for the next level of recursion.
   */
  recursed(): FuzzContext;
  /**
   * false iff the fuzzer should not recurse deeper.
   */
  mayRecurse(): boolean;
}

export interface Fuzzer<
  T = unknown,
  U = unknown,
  C extends t.Decoder<U, T> = t.Decoder<U, T>
> {
  readonly id: string;
  readonly idType: 'name' | 'tag';
  readonly impl: FuzzerGenerator<T, U, C> | ImmediateConcreteFuzzer<T, U>;
}

export interface FuzzerGenerator<T, U, C extends t.Decoder<U, T>> {
  readonly type: 'generator';
  readonly func: fuzzGenerator<T, U, C>;
}

export interface ImmediateConcreteFuzzer<T, U> extends ConcreteFuzzer<T, U> {
  readonly type: 'fuzzer';
}

export interface ConcreteFuzzer<T, U> {
  // tslint:disable-next-line:no-any
  readonly children?: Array<t.Decoder<any, unknown>>;
  readonly mightRecurse?: boolean;
  readonly func: (
    ctx: FuzzContext,
    n: number,
    ...h: Array<FuzzerUnit<unknown>>
  ) => U;
}

export function fuzzerByName<T, U, C extends t.Decoder<U, T>>(
  impl: Fuzzer<T, U, C>['impl'],
  name: C['name']
): Fuzzer<T, U, C> {
  return {
    impl,
    id: name,
    idType: 'name',
  };
}

export function concreteFuzzerByName<T, U, C extends t.Decoder<U, T>>(
  func: ConcreteFuzzer<T, U>['func'],
  name: C['name']
): Fuzzer<T, U, C> {
  return fuzzerByName(
    {
      type: 'fuzzer',
      func,
      mightRecurse: false,
    },
    name
  );
}

export type fuzzGenerator<T, U, C extends t.Decoder<U, T>> = (
  b: C
) => ConcreteFuzzer<T, U>;

export type ContextOpts = Partial<typeof defaultContextOpt>;

const defaultContextOpt = {
  maxRecursionHint: 4,
};

export function fuzzContext(opt: ContextOpts = defaultContextOpt): FuzzContext {
  class FC implements FuzzContext {
    constructor(private readonly maxRecursionHint: number) {}
    recursed(): FuzzContext {
      return new FC(this.maxRecursionHint - 1);
    }
    mayRecurse(): boolean {
      return this.maxRecursionHint > 0;
    }
  }
  const ropt = { ...defaultContextOpt, ...opt };
  return new FC(ropt.maxRecursionHint);
}

/**
 * Given a number and a context, generates a pseudorandom instance of T.
 *
 * ExampleGenerators are stateless:
 */
export interface ExampleGenerator<T>
  extends t.Encoder<[number, FuzzContext], T> {}

export interface FuzzerUnit<U> extends ExampleGenerator<U> {
  readonly mightRecurse: boolean;
}

interface CachedFuzzerUnit<T, U> extends FuzzerUnit<U> {
  readonly decoder: t.Decoder<U, T>;
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

// tslint:disable-next-line:no-any
type CacheCF = Map<t.Decoder<any, unknown>, ConcreteFuzzer<unknown, any>>;

type CacheEG = Map<
  // tslint:disable-next-line:no-any
  ConcreteFuzzer<unknown, any>,
  // tslint:disable-next-line:no-any
  CachedFuzzerUnit<unknown, any>
>;
class Cache {
  readonly cf: CacheCF = new Map();
  readonly ef: CacheEG = new Map();
}

function encoderFunction<T, U>(
  k: ConcreteFuzzer<T, U>,
  children: Array<FuzzerUnit<unknown>>
): ExampleGenerator<U>['encode'] {
  return (a: [number, FuzzContext]) => {
    return k.func(k.mightRecurse ? a[1].recursed() : a[1], a[0], ...children);
  };
}

function cachedExampleGeneratorFromConcreteFuzzer<T, U>(
  c: Cache,
  r: Registry,
  fi: ConcreteFuzzer<T, U>,
  d: t.Decoder<U, T>
): CachedFuzzerUnit<T, U> {
  const g = c.ef.get(fi);
  if (g != null) {
    return g as CachedFuzzerUnit<T, U>;
  }
  // allows us to cache circular references
  const mut: Mutable<CachedFuzzerUnit<T, U>> = {
    encode: (undefined as unknown) as t.Encode<[number, FuzzContext], U>,
    mightRecurse: !!fi.mightRecurse,
    decoder: d,
  };
  c.ef.set(fi, mut as CachedFuzzerUnit<unknown, unknown>);
  const children = fi.children
    ? fi.children.map(x => cachedExampleGenerator(c, r, x))
    : [];
  mut.mightRecurse =
    mut.mightRecurse || children.findIndex(v => v.mightRecurse) > -1;
  mut.encode = encoderFunction(fi, children);
  return mut;
}

function cachedExampleGenerator<T, U>(
  c: Cache,
  r: Registry,
  d: t.Decoder<U, T>
): CachedFuzzerUnit<T, U> {
  const g = c.cf.get(d);
  if (g != null) {
    return cachedExampleGeneratorFromConcreteFuzzer<T, U>(
      c,
      r,
      g as ConcreteFuzzer<T, U>,
      d
    );
  }
  const f = r.getFuzzer(d);
  if (!f) {
    throw new RangeError(`IOTSF0001: no fuzzer for ${d.name}`);
  }
  const fi = f.impl;
  const cf = fi.type === 'fuzzer' ? fi : fi.func(d);
  c.cf.set(d, cf);
  return cachedExampleGeneratorFromConcreteFuzzer(c, r, cf, d);
}

export function exampleGenerator<T, U>(
  r: Registry,
  d: t.Decoder<U, T>
): ExampleGenerator<U> {
  const c = new Cache();
  const ret = { ...cachedExampleGenerator(c, r, d) };
  delete ret.mightRecurse;
  delete ret.decoder;
  return ret;
}

export function exampleOf<T, U>(
  d: t.Decoder<U, T>,
  r: Registry,
  a: number,
  maxRecursionHint?: number
): U {
  return exampleGenerator(r, d).encode([a, fuzzContext({ maxRecursionHint })]);
}
