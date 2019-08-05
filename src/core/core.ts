import * as t from 'io-ts';
import { Fuzzer, ConcreteFuzzer, fuzzGenerator } from '../fuzzer';

export type BasicType =
  | t.NumberType
  | t.BooleanType
  | t.StringType
  | t.NullType
  | t.UndefinedType
  | t.VoidType
  | t.UnknownType
  | t.UnionType<t.Mixed[]>
  | t.InterfaceType<unknown>
  | t.PartialType<unknown>
  | t.ArrayType<t.Mixed>
  | t.IntersectionType<t.Mixed[]>
  | t.LiteralType<string | number | boolean>
  | t.KeyofType<{ [key: string]: unknown }>
  | t.TupleType<t.Mixed[]>
  // not yet supported:
  | t.AnyArrayType
  | t.AnyDictionaryType
  | t.RefinementType<t.Mixed>
  | t.RecursiveType<t.Mixed>
  | t.DictionaryType<t.Mixed, t.Mixed>
  | t.ReadonlyType<t.Mixed>
  | t.ReadonlyArrayType<t.Mixed>
  | t.ExactType<t.Mixed>;

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

export function fuzzKeyof(
  b: t.KeyofType<{ [key: string]: unknown }>
): ConcreteFuzzer<unknown> {
  return {
    func: n => {
      const h = Object.getOwnPropertyNames(b.keys);
      return h[n % h.length];
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
        ret[keys[i]] = v.encode(n + i);
      });
      return ret;
    },
  };
}

export function fuzzTuple(
  b: t.TupleType<t.Mixed[]>
): ConcreteFuzzer<unknown[]> {
  return {
    children: b.types,
    func: (n, ...h) => {
      return h.map((v, i) => v.encode(n + i));
    },
  };
}

export const defaultMaxArrayLength = 13;

const fuzzArrayWithMaxLength = (maxLength: number = defaultMaxArrayLength) => (
  b: t.ArrayType<t.Mixed>
): ConcreteFuzzer<unknown[]> => {
  return {
    children: [b.type],
    func: (n, h0) => {
      const ret = [];
      for (let index = 0; index < n % maxLength; index++) {
        ret.push(h0.encode(n + index));
      }
      return ret;
    },
  };
};

export function arrayFuzzer(maxLength: number = defaultMaxArrayLength) {
  return gen(fuzzArrayWithMaxLength(maxLength), 'ArrayType');
}

/**
 * @deprecated
 */
export const fuzzArray = fuzzArrayWithMaxLength();

const fuzzPartialWithExtraCodec = (
  extra: t.Props = { ___0000_extra_: t.number }
) => (b: t.PartialType<t.Props>): ConcreteFuzzer<unknown> => {
  const kk = Object.getOwnPropertyNames(b.props);
  const xx = Object.getOwnPropertyNames(extra);
  const keys = Object.getOwnPropertyNames(b.props).concat(
    Object.getOwnPropertyNames(extra)
  );
  const vals = keys.map((k, i) =>
    i < kk.length ? b.props[k] : extra[xx[i - kk.length]]
  );
  return {
    children: vals,
    func: (n, ...h) => {
      const ret = Object.create(null);
      h.forEach((v, i) => {
        if (n & (2 ** i)) {
          // Only allow key indices from the original type
          // or added keys without indices.
          if (i < kk.length || !kk.includes(keys[i])) {
            ret[keys[i]] = v.encode(n + i);
          }
        }
      });
      return ret;
    },
  };
};

export function partialFuzzer(extra: t.Props = { ___0000_extra_: t.number }) {
  return gen(fuzzPartialWithExtraCodec(extra), 'PartialType');
}

/**
 * @deprecated
 */
export const fuzzPartial = fuzzPartialWithExtraCodec();

export function fuzzIntersection(
  b: t.IntersectionType<t.Any[]>
): ConcreteFuzzer<unknown> {
  return {
    children: b.types,
    func: (n, ...h) => {
      let ret: unknown = undefined;
      h.forEach((v, i) => {
        if (ret === undefined) {
          ret = v.encode(n + i);
        } else {
          ret = { ...ret, ...v.encode(n + i) };
        }
      });
      return ret;
    },
  };
}

export const coreFuzzers = [
  concrete(fuzzNumber, 'NumberType'),
  concrete(fuzzBoolean, 'BooleanType'),
  concrete(fuzzString, 'StringType'),
  concrete(fuzzNull, 'NullType'),
  concrete(fuzzUndefined, 'UndefinedType'),
  concrete(fuzzVoid, 'VoidType'),
  concrete(fuzzUnknown, 'UnknownType'),
  gen(fuzzUnion, 'UnionType'),
  gen(fuzzInterface, 'InterfaceType'),
  partialFuzzer(),
  arrayFuzzer(),
  gen(fuzzIntersection, 'IntersectionType'),
  gen(fuzzLiteral, 'LiteralType'),
  gen(fuzzKeyof, 'KeyofType'),
  gen(fuzzTuple, 'TupleType'),
  concreteNamed(fuzzInt, 'Int'),
];
