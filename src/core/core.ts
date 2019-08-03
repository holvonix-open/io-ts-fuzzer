import * as t from 'io-ts';
import { Fuzzer, ConcreteFuzzer, fuzzGenerator } from '../fuzzer';

export type BasicType =
  | t.NullType
  | t.UndefinedType
  | t.VoidType
  | t.UnknownType
  | t.StringType
  | t.NumberType
  | t.BooleanType
  | t.AnyArrayType
  | t.AnyDictionaryType
  | t.RefinementType<t.Any>
  | t.LiteralType<string | number | boolean>
  | t.KeyofType<{ [key: string]: unknown }>
  | t.RecursiveType<t.Any>
  | t.ArrayType<t.Any>
  // tslint:disable-next-line:no-any
  | t.InterfaceType<any>
  // tslint:disable-next-line:no-any
  | t.PartialType<any>
  | t.DictionaryType<t.Any, t.Any>
  | t.UnionType<t.Any[]>
  // tslint:disable-next-line:no-any
  | t.InterfaceType<any>
  | t.TupleType<t.Any[]>
  | t.ReadonlyType<t.Any>
  | t.ReadonlyArrayType<t.Any>
  | t.ExactType<t.Any>
  | t.UnknownType;

export type basicFuzzGenerator<
  T,
  C extends t.Decoder<unknown, T> & BasicType
> = fuzzGenerator<T, C>;

export type basicLiteralConcreteFuzzer<
  T,
  C extends t.Decoder<unknown, T> & BasicType
> = ConcreteFuzzer<T>['func'];

export type BasicFuzzer<
  T,
  C extends t.Decoder<unknown, T> & BasicType
> = Fuzzer<T, C>;

export function concrete<T, C extends t.Decoder<unknown, T> & BasicType>(
  func: basicLiteralConcreteFuzzer<T, C>,
  tag: C['_tag']
): BasicFuzzer<T, C> {
  return {
    impl: {
      type: 'fuzzer',
      func,
    },
    id: tag,
    idType: 'tag',
  };
}

export function gen<T, C extends t.Decoder<unknown, T> & BasicType>(
  func: basicFuzzGenerator<T, C>,
  tag: C['_tag']
): BasicFuzzer<T, C> {
  return {
    impl: {
      type: 'generator',
      func,
    },
    id: tag,
    idType: 'tag',
  };
}

export function fuzzBoolean(n: number) {
  return n % 2 === 0;
}

export function fuzzNumber(n: number) {
  return n;
}

export function fuzzString(n: number) {
  return `${n}`;
}

// tslint:disable-next-line:no-any
export function fuzzUnion(b: t.UnionC<any>): ConcreteFuzzer<any> {
  return {
    children: b.types,
    func: (n, ...h) => {
      return h[n % h.length].encode(n);
    },
  };
}

export const coreFuzzers = [
  concrete(fuzzNumber, 'NumberType'),
  concrete(fuzzBoolean, 'BooleanType'),
  concrete(fuzzString, 'StringType'),
  gen(fuzzUnion, 'UnionType'),
];
