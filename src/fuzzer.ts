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
  C extends t.Decoder<unknown, T> = t.Decoder<unknown, T>
> {
  readonly id: string;
  readonly idType: 'name' | 'tag';
  readonly impl: FuzzerGenerator<T, C> | ImmediateConcreteFuzzer<T>;
}

export interface FuzzerGenerator<T, C extends t.Decoder<unknown, T>> {
  readonly type: 'generator';
  readonly func: fuzzGenerator<T, C>;
}

export interface ImmediateConcreteFuzzer<T> extends ConcreteFuzzer<T> {
  readonly type: 'fuzzer';
}

export interface ConcreteFuzzer<T> {
  readonly children?: Array<t.Decoder<unknown, unknown>>;
  readonly mightRecurse?: boolean;
  readonly func: (
    ctx: FuzzContext,
    n: number,
    ...h: Array<FuzzerUnit<unknown>>
  ) => T;
}

export function concreteFuzzerByName<T, C extends t.Decoder<unknown, T>>(
  func: ConcreteFuzzer<T>['func'],
  name: C['name']
): Fuzzer<T, C> {
  return {
    impl: {
      type: 'fuzzer',
      func,
      mightRecurse: false,
    },
    id: name,
    idType: 'name',
  };
}

export type fuzzGenerator<T, C extends t.Decoder<unknown, T>> = (
  b: C
) => ConcreteFuzzer<T>;

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

export interface FuzzerUnit<T> extends ExampleGenerator<T> {
  readonly mightRecurse: boolean;
}

interface CachedFuzzerUnit<T> extends FuzzerUnit<T> {
  readonly decoder: t.Decoder<unknown, T>;
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

type CacheCF = Map<t.Decoder<unknown, unknown>, ConcreteFuzzer<unknown>>;
type CacheEG = Map<ConcreteFuzzer<unknown>, CachedFuzzerUnit<unknown>>;
class Cache {
  readonly cf: CacheCF = new Map();
  readonly ef: CacheEG = new Map();
}

function encoderFunction<T>(
  k: ConcreteFuzzer<T>,
  children: Array<FuzzerUnit<unknown>>
): ExampleGenerator<T>['encode'] {
  return (a: [number, FuzzContext]) => {
    return k.func(k.mightRecurse ? a[1].recursed() : a[1], a[0], ...children);
  };
}

function cachedExampleGeneratorFromConcreteFuzzer<T>(
  c: Cache,
  r: Registry,
  fi: ConcreteFuzzer<T>,
  d: t.Decoder<unknown, T>
): CachedFuzzerUnit<T> {
  const g = c.ef.get(fi);
  if (g != null) {
    return g as CachedFuzzerUnit<T>;
  }
  // allows us to cache circular references
  const mut: Mutable<CachedFuzzerUnit<T>> = {
    encode: (undefined as unknown) as t.Encode<[number, FuzzContext], T>,
    mightRecurse: !!fi.mightRecurse,
    decoder: d,
  };
  c.ef.set(fi, mut);
  const children = fi.children
    ? fi.children.map(x => cachedExampleGenerator(c, r, x))
    : [];
  mut.mightRecurse =
    mut.mightRecurse || children.findIndex(v => v.mightRecurse) > -1;
  mut.encode = encoderFunction(fi, children);
  return mut;
}

function cachedExampleGenerator<T>(
  c: Cache,
  r: Registry,
  d: t.Decoder<unknown, T>
): CachedFuzzerUnit<T> {
  const g = c.cf.get(d);
  if (g != null) {
    return cachedExampleGeneratorFromConcreteFuzzer<T>(
      c,
      r,
      g as ConcreteFuzzer<T>,
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

export function exampleGenerator<T>(
  r: Registry,
  d: t.Decoder<unknown, T>
): ExampleGenerator<T> {
  const c = new Cache();
  const ret = { ...cachedExampleGenerator(c, r, d) };
  delete ret.mightRecurse;
  delete ret.decoder;
  return ret;
}

export function exampleOf<T>(
  d: t.Decoder<unknown, T>,
  r: Registry,
  a: number,
  maxRecursionHint?: number
): T {
  return exampleGenerator(r, d).encode([a, fuzzContext({ maxRecursionHint })]);
}
