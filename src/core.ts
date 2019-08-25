import * as t from 'io-ts';
import {
  Fuzzer,
  ConcreteFuzzer,
  fuzzGenerator,
  FuzzContext,
  FuzzerUnit,
  concreteFuzzerByName,
} from './fuzzer';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { rngi, rng } from './rng';

type BasicType =
  | t.AnyArrayType
  | t.ArrayType<t.Mixed>
  | t.BooleanType
  | t.ExactType<t.Mixed>
  | t.InterfaceType<unknown>
  | t.IntersectionType<t.Mixed[]>
  | t.KeyofType<{ [key: string]: unknown }>
  | t.LiteralType<string | number | boolean>
  | t.NullType
  | t.NumberType
  | t.PartialType<unknown>
  | t.ReadonlyArrayType<t.Mixed>
  | t.ReadonlyType<t.Mixed>
  | t.StringType
  | t.TupleType<t.Mixed[]>
  | t.UndefinedType
  | t.UnionType<t.Mixed[]>
  | t.UnknownType
  | t.VoidType
  | t.RecursiveType<t.Mixed>
  // not yet supported:
  | t.AnyDictionaryType
  | t.DictionaryType<t.Mixed, t.Mixed>
  | t.RefinementType<t.Mixed>;

type basicFuzzGenerator<
  T,
  U,
  C extends t.Decoder<U, T> & BasicType
> = fuzzGenerator<T, U, C>;

type basicLiteralConcreteFuzzer<
  T,
  U,
  C extends t.Decoder<U, T> & BasicType
> = ConcreteFuzzer<T, U>['func'];

type BasicFuzzer<T, U, C extends t.Decoder<U, T> & BasicType> = Fuzzer<T, U, C>;

function concrete<T, U, C extends t.Decoder<U, T> & BasicType>(
  func: basicLiteralConcreteFuzzer<T, U, C>,
  tag: C['_tag']
): BasicFuzzer<T, U, C> {
  return {
    impl: {
      type: 'fuzzer',
      func,
      mightRecurse: false,
    },
    id: tag,
    idType: 'tag',
  };
}

function gen<T, U, C extends t.Decoder<U, T> & BasicType>(
  func: basicFuzzGenerator<T, U, C>,
  tag: C['_tag']
): BasicFuzzer<T, U, C> {
  return {
    impl: {
      type: 'generator',
      func,
    },
    id: tag,
    idType: 'tag',
  };
}

export function fuzzBoolean(_: FuzzContext, n: number): boolean {
  return rng(n).int32() % 2 === 0;
}

export function fuzzNumber(_: FuzzContext, n: number): number {
  return n / Math.PI;
}

export function fuzzInt(_: FuzzContext, n: number): t.TypeOf<typeof t.Int> {
  return rng(n).int32() as t.TypeOf<typeof t.Int>;
}

export function fuzzString(_: FuzzContext, n: number): string {
  return (Math.abs(n) / Math.PI).toString(36);
}

export function fuzzNull(): null {
  return null;
}

export function fuzzUndefined(): undefined {
  return undefined;
}

export function fuzzVoid(): void {}

export const defaultUnknownType = t.type({ __default_any_0: t.number });

const fuzzUnknownWithType = (codec: t.Decoder<unknown, unknown>) => (
  b: t.UnknownType
): ConcreteFuzzer<unknown, unknown> => {
  return {
    // unknown recursion handled specially below
    mightRecurse: false,
    children: [codec],
    func: (ctx, n, h0) =>
      ctx.mayRecurse() ? h0.encode([rngi(n), ctx.recursed()]) : rngi(n),
  };
};

export function unknownFuzzer(
  codec: t.Decoder<unknown, unknown> = defaultUnknownType
) {
  return gen(fuzzUnknownWithType(codec), 'UnknownType');
}

export function fuzzLiteral(
  b: t.LiteralType<string | number | boolean>
): ConcreteFuzzer<string | number | boolean, unknown> {
  return {
    mightRecurse: false,
    func: () => {
      return b.value;
    },
  };
}

export function fuzzUnion(
  b: t.UnionType<t.Mixed[]>
): ConcreteFuzzer<unknown, unknown> {
  return {
    mightRecurse: false,
    children: b.types,
    func: (ctx, n, ...h0) => {
      const r = rng(n);
      const h1 = ctx.mayRecurse() ? h0 : h0.filter(f => !f.mightRecurse);
      const h = h1.length === 0 ? h0 : h1;
      return h[Math.abs(r.int32()) % h.length].encode([r.int32(), ctx]);
    },
  };
}

export function fuzzKeyof(
  b: t.KeyofType<{ [key: string]: unknown }>
): ConcreteFuzzer<unknown, unknown> {
  return {
    mightRecurse: false,
    func: (_, n) => {
      const h = Object.getOwnPropertyNames(b.keys);
      return h[rngi(n) % h.length];
    },
  };
}

export function fuzzTuple(
  b: t.TupleType<t.Mixed[]>
): ConcreteFuzzer<unknown[], unknown> {
  return {
    mightRecurse: false,
    children: b.types,
    func: (ctx, n, ...h) => {
      const r = rng(n);
      return h.map((v, i) => v.encode([r.int32(), ctx]));
    },
  };
}

export function fuzzExact(
  b: t.ExactC<t.HasProps>
): ConcreteFuzzer<unknown, unknown> {
  return {
    mightRecurse: false,
    children: [b.type],
    func: (ctx, n, h0) => {
      const r = h0.encode([n, ctx]);
      const d = b.decode(r);
      /* istanbul ignore if */
      if (!isRight(d)) {
        throw new Error(`IOTSF0003: codec failed to decode underlying example`);
      }
      return d.right;
    },
  };
}

export function fuzzReadonly(
  b: t.ReadonlyType<t.Any>
): ConcreteFuzzer<unknown, unknown> {
  return {
    mightRecurse: false,
    children: [b.type],
    func: (ctx, n, h0) => {
      const r = h0.encode([n, ctx]);
      return Object.freeze(r);
    },
  };
}

export function fuzzRecursive(
  b: t.RecursiveType<t.Mixed>
): ConcreteFuzzer<unknown, unknown> {
  return {
    mightRecurse: true,
    children: [b.type],
    func: (ctx, n, h0) => {
      return h0.encode([rngi(n), ctx]);
    },
  };
}

function recordFuzzFunc<K, V>(maxCount: number) {
  return (
    ctx: FuzzContext,
    n: number,
    hk: FuzzerUnit<unknown>,
    hv: FuzzerUnit<unknown>
  ) => {
    const ret = Object.create(null);
    const r = rng(n);
    if (!ctx.mayRecurse() && (hk.mightRecurse || hv.mightRecurse)) {
      return ret;
    }
    const ml = Math.abs(r.int32()) % maxCount;
    for (let index = 0; index < ml; index++) {
      const k = hk.encode([r.int32(), ctx]) as K;
      const kt = typeof k;
      if (kt !== 'string') {
        throw new Error(
          'IOTSF0004: recordFuzzer cannot support non-(string, number, boolean) key types'
        );
      }
      const v = hv.encode([r.int32(), ctx]) as V;
      ret[k] = v;
    }
    return ret;
  };
}

export const defaultMaxRecordCount = 5;

const fuzzUnknownRecordWithMaxCount = (maxCount: number) => (
  b: t.AnyDictionaryType
): ConcreteFuzzer<unknown, unknown> => {
  return {
    mightRecurse: false,
    children: [t.string, t.unknown],
    func: recordFuzzFunc<string, unknown>(maxCount),
  };
};

export function unknownRecordFuzzer(maxCount: number = defaultMaxRecordCount) {
  return gen(fuzzUnknownRecordWithMaxCount(maxCount), 'AnyDictionaryType');
}

const fuzzRecordWithMaxCount = (maxCount: number) => (
  b: t.DictionaryType<t.Any, t.Any>
): ConcreteFuzzer<unknown, unknown> => {
  return {
    mightRecurse: false,
    children: [b.domain, b.codomain],
    func: recordFuzzFunc<unknown, unknown>(maxCount),
  };
};

export function recordFuzzer(maxCount: number = defaultMaxRecordCount) {
  return gen(fuzzRecordWithMaxCount(maxCount), 'DictionaryType');
}

function arrayFuzzFunc(maxLength: number) {
  return (ctx: FuzzContext, n: number, h0: FuzzerUnit<unknown>) => {
    const ret: unknown[] = [];
    const r = rng(n);
    if (!ctx.mayRecurse() && h0.mightRecurse) {
      return ret;
    }
    const ml = Math.abs(r.int32()) % maxLength;
    for (let index = 0; index < ml; index++) {
      ret.push(h0.encode([r.int32(), ctx]));
    }
    return ret;
  };
}

export const defaultMaxArrayLength = 5;

const fuzzArrayWithMaxLength = (maxLength: number) => (
  b: t.ArrayType<t.Mixed>
): ConcreteFuzzer<unknown[], unknown> => {
  return {
    mightRecurse: false,
    children: [b.type],
    func: arrayFuzzFunc(maxLength),
  };
};

export function arrayFuzzer(maxLength: number = defaultMaxArrayLength) {
  return gen(fuzzArrayWithMaxLength(maxLength), 'ArrayType');
}

const fuzzReadonlyArrayWithMaxLength = (maxLength: number) => (
  b: t.ReadonlyArrayType<t.Mixed>
): ConcreteFuzzer<unknown[], unknown> => {
  return {
    mightRecurse: false,
    children: [b.type],
    func: (ctx, n, h0) => {
      const ret: unknown[] = [];
      const r = rng(n);
      if (!ctx.mayRecurse() && h0.mightRecurse) {
        return ret;
      }
      const ml = Math.abs(r.int32()) % maxLength;
      for (let index = 0; index < ml; index++) {
        ret.push(Object.freeze(h0.encode([r.int32(), ctx])));
      }
      return ret;
    },
  };
};

export function readonlyArrayFuzzer(maxLength: number = defaultMaxArrayLength) {
  return gen(fuzzReadonlyArrayWithMaxLength(maxLength), 'ReadonlyArrayType');
}

const fuzzAnyArrayWithMaxLength = (maxLength: number) => (
  b: t.AnyArrayType
): ConcreteFuzzer<unknown[], unknown> => {
  return {
    mightRecurse: false,
    children: [t.unknown],
    func: arrayFuzzFunc(maxLength),
  };
};

export function anyArrayFuzzer(maxLength: number = defaultMaxArrayLength) {
  return gen(fuzzAnyArrayWithMaxLength(maxLength), 'AnyArrayType');
}

export const defaultExtraProps = { ___0000_extra_: t.number };

export const fuzzPartialWithExtraCodec = (extra: t.Props) => (
  b: t.PartialType<t.Props>
): ConcreteFuzzer<unknown, unknown> => {
  const kk = Object.getOwnPropertyNames(b.props);
  const xx = Object.getOwnPropertyNames(extra);
  const keys = Object.getOwnPropertyNames(b.props).concat(
    Object.getOwnPropertyNames(extra)
  );
  const vals = keys.map((k, i) =>
    i < kk.length ? b.props[k] : extra[xx[i - kk.length]]
  );
  return {
    mightRecurse: false,
    children: vals,
    func: (ctx, n0, ...h) => {
      const ret = Object.create(null);
      const r = rng(n0);
      h.forEach((v, i) => {
        if ((ctx.mayRecurse() || !v.mightRecurse) && r.int32() % 2 === 0) {
          // Only allow key indices from the original type
          // or added keys not present in original type.
          if (i < kk.length || !kk.includes(keys[i])) {
            ret[keys[i]] = v.encode([r.int32(), ctx]);
          }
        }
      });
      return ret;
    },
  };
};

export function partialFuzzer(extra: t.Props = defaultExtraProps) {
  return gen(fuzzPartialWithExtraCodec(extra), 'PartialType');
}

export const fuzzInterfaceWithExtraCodec = (extra: t.Props) => (
  b: t.InterfaceType<t.Props>
): ConcreteFuzzer<unknown, unknown> => {
  const kk = Object.getOwnPropertyNames(b.props);
  const xx = Object.getOwnPropertyNames(extra);
  const keys = Object.getOwnPropertyNames(b.props).concat(
    Object.getOwnPropertyNames(extra)
  );
  const vals = keys.map((k, i) =>
    i < kk.length ? b.props[k] : extra[xx[i - kk.length]]
  );
  return {
    mightRecurse: false,
    children: vals,
    func: (ctx, n0, ...h) => {
      const ret = Object.create(null);
      const r = rng(n0);
      h.forEach((v, i) => {
        if (i < kk.length) {
          ret[keys[i]] = v.encode([r.int32(), ctx]);
        } else if (
          (ctx.mayRecurse() || !v.mightRecurse) &&
          r.int32() % 2 === 0
        ) {
          // Only allow added keys not present in original type.
          if (!kk.includes(keys[i])) {
            ret[keys[i]] = v.encode([r.int32(), ctx]);
          }
        }
      });
      return ret;
    },
  };
};

export function interfaceFuzzer(extra: t.Props = defaultExtraProps) {
  return gen(fuzzInterfaceWithExtraCodec(extra), 'InterfaceType');
}

export function fuzzIntersection(
  b: t.IntersectionType<t.Any[]>
): ConcreteFuzzer<unknown, unknown> {
  return {
    mightRecurse: false,
    children: b.types,
    func: (ctx, n, ...h) => {
      let d = 0;
      let ret: unknown = undefined;
      const r = rng(n);
      do {
        ret = undefined;
        h.forEach((v, i) => {
          let lp: unknown;
          lp = v.encode([r.int32(), ctx]);
          if (typeof lp !== 'object') {
            throw new Error(
              'IOTSF0002: fuzzIntersection cannot support non-object types'
            );
          }
          if (ret === undefined) {
            ret = lp;
          } else {
            ret = { ...ret, ...lp };
          }
        });
        d++;
      } while (h.findIndex((_, i) => isLeft(b.types[i].decode(ret))) > -1);
      return ret;
    },
  };
}

// tslint:disable-next-line:no-any
export const coreFuzzers: ReadonlyArray<Fuzzer<unknown, unknown, any>> = [
  concrete(fuzzNumber, 'NumberType'),
  concreteFuzzerByName(fuzzInt, 'Int'),
  concrete(fuzzBoolean, 'BooleanType'),
  concrete(fuzzString, 'StringType'),
  concrete(fuzzNull, 'NullType'),
  concrete(fuzzUndefined, 'UndefinedType'),
  concrete(fuzzVoid, 'VoidType'),
  unknownFuzzer(),
  interfaceFuzzer(),
  partialFuzzer(),
  arrayFuzzer(),
  anyArrayFuzzer(),
  recordFuzzer(),
  unknownRecordFuzzer(),
  gen(fuzzExact, 'ExactType'),
  gen(fuzzReadonly, 'ReadonlyType'),
  readonlyArrayFuzzer(),
  gen(fuzzUnion, 'UnionType'),
  gen(fuzzIntersection, 'IntersectionType'),
  gen(fuzzLiteral, 'LiteralType'),
  gen(fuzzKeyof, 'KeyofType'),
  gen(fuzzTuple, 'TupleType'),
  gen(fuzzRecursive, 'RecursiveType'),
  // tslint:disable-next-line:no-any
] as ReadonlyArray<Fuzzer<unknown, unknown, any>>;
