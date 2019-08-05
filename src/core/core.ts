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
  | t.RefinementType<t.Mixed>
  | t.LiteralType<string | number | boolean>
  | t.KeyofType<{ [key: string]: unknown }>
  | t.RecursiveType<t.Mixed>
  | t.ArrayType<t.Mixed>
  | t.InterfaceType<unknown>
  | t.PartialType<unknown>
  | t.DictionaryType<t.Mixed, t.Mixed>
  | t.UnionType<t.Mixed[]>
  | t.IntersectionType<t.Mixed[]>
  | t.InterfaceType<unknown>
  | t.TupleType<t.Mixed[]>
  | t.ReadonlyType<t.Mixed>
  | t.ReadonlyArrayType<t.Mixed>
  | t.ExactType<t.Mixed>
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

export function concreteNamed<T, C extends t.Decoder<unknown, T>>(
  func: ConcreteFuzzer<T>['func'],
  name: C['name']
): Fuzzer<T, C> {
  return {
    impl: {
      type: 'fuzzer',
      func,
    },
    id: name,
    idType: 'name',
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

export function fuzzBoolean(n: number): boolean {
  return n % 2 === 0;
}

export function fuzzNumber(n: number): number {
  return n;
}

export function fuzzInt(n: number): t.TypeOf<typeof t.Int> {
  return Math.floor(n) as t.TypeOf<typeof t.Int>;
}

export function fuzzString(n: number): string {
  return `${n}`;
}

export function fuzzNull(): null {
  return null;
}

export function fuzzUndefined(): undefined {
  return undefined;
}

export function fuzzVoid(): void {}

export function fuzzUnknown(n: number): unknown {
  return n;
}

export function fuzzLiteral(
  b: t.LiteralType<string | number | boolean>
): ConcreteFuzzer<unknown> {
  return {
    func: n => {
      return b.value;
    },
  };
}

export function fuzzUnion(b: t.UnionType<t.Mixed[]>): ConcreteFuzzer<unknown> {
  return {
    children: b.types,
    func: (n, ...h) => {
      return h[n % h.length].encode(n);
    },
  };
}

export function fuzzInterface(
  b: t.InterfaceType<t.Props>
): ConcreteFuzzer<unknown> {
  const keys = Object.getOwnPropertyNames(b.props);
  const vals = keys.map(k => b.props[k]);
  return {
    children: vals,
    func: (n, ...h) => {
      const ret = Object.create(null);
      h.forEach((v, i) => {
        ret[keys[i]] = v.encode(n);
      });
      return ret;
    },
  };
}

export function fuzzArray(b: t.ArrayType<t.Mixed>): ConcreteFuzzer<unknown[]> {
  return {
    children: [b.type],
    func: (n, h0) => {
      const ret = [];
      for (let index = 0; index < n % 103; index++) {
        ret.push(h0.encode(n + index));
      }
      return ret;
    },
  };
}

export function fuzzPartial(
  b: t.PartialType<t.Props>
): ConcreteFuzzer<unknown> {
  const keys = Object.getOwnPropertyNames(b.props);
  const vals = keys.map(k => b.props[k]);
  return {
    children: vals,
    func: (n, ...h) => {
      const ret = Object.create(null);
      h.forEach((v, i) => {
        if (n & (2 ** i)) {
          ret[keys[i]] = v.encode(n);
        }
      });
      return ret;
    },
  };
}

export function fuzzIntersection(
  b: t.IntersectionType<t.Any[]>
): ConcreteFuzzer<unknown> {
  return {
    children: b.types,
    func: (n, ...h) => {
      let ret: unknown = undefined;
      h.forEach((v, i) => {
        if (ret === undefined) {
          ret = v.encode(n);
        } else {
          ret = { ...ret, ...v.encode(n) };
        }
      });
      return ret;
    },
  };
}

export const coreFuzzers = [
  concrete(fuzzNumber, 'NumberType'),
  concreteNamed(fuzzInt, 'Int'),
  concrete(fuzzBoolean, 'BooleanType'),
  concrete(fuzzString, 'StringType'),
  concrete(fuzzNull, 'NullType'),
  concrete(fuzzUndefined, 'UndefinedType'),
  concrete(fuzzVoid, 'VoidType'),
  concrete(fuzzUnknown, 'UnknownType'),
  gen(fuzzUnion, 'UnionType'),
  gen(fuzzInterface, 'InterfaceType'),
  gen(fuzzPartial, 'PartialType'),
  gen(fuzzArray, 'ArrayType'),
  gen(fuzzIntersection, 'IntersectionType'),
  gen(fuzzLiteral, 'LiteralType'),
];
