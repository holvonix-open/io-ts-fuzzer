import * as t from 'io-ts';
import { Registry } from './registry';

export interface Fuzzer<T, C extends t.Decoder<unknown, T>> {
  id: string;
  idType: 'name' | 'tag';
  impl: FuzzerGenerator<T, C> | ImmediateConcreteFuzzer<T>;
}

export interface FuzzerGenerator<T, C extends t.Decoder<unknown, T>> {
  type: 'generator';
  func: fuzzGenerator<T, C>;
}

export interface ImmediateConcreteFuzzer<T> extends ConcreteFuzzer<T> {
  type: 'fuzzer';
}

export interface ConcreteFuzzer<T> {
  children?: Array<t.Decoder<unknown, unknown>>;

  func: (n: number, ...h: Array<ExampleGenerator<unknown>>) => T;
}

export type fuzzGenerator<T, C extends t.Decoder<unknown, T>> = (
  b: C
) => ConcreteFuzzer<T>;

/**
 * Given a number, generates a pseudorandom (but deterministic)
 * instance of T.
 */
export type ExampleGenerator<T> = t.Encoder<number, T>;

export function exampleOf<T>(
  d: t.Decoder<unknown, T>,
  r: Registry,
  a: number
): T {
  return exampleGenerator(r, d).encode(a);
}

export function exampleGeneratorFromConcreteFuzzer<T>(
  r: Registry,
  fi: ConcreteFuzzer<T>
): ExampleGenerator<T> {
  const k = fi.func;
  const children = fi.children
    ? fi.children.map(x => exampleGenerator(r, x))
    : [];
  return {
    encode: a => k(a, ...children),
  };
}

export function exampleGenerator<T>(
  r: Registry,
  d: t.Decoder<unknown, T>
): ExampleGenerator<T> {
  const f = r.getFuzzer(d);
  if (!f) {
    throw new RangeError(`no fuzzer for ${d.name}`);
  }
  const fi = f.impl;
  return exampleGeneratorFromConcreteFuzzer(
    r,
    fi.type === 'fuzzer' ? fi : fi.func(d)
  );
}
