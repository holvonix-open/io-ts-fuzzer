import * as t from 'io-ts';

export const types = [
  // Simple 0- or 1-depth types
  t.number,
  t.string,
  t.boolean,
  t.union([t.string, t.number, t.boolean]),
  t.intersection([t.type({ s: t.string }), t.type({ m: t.number })]),
  t.type({ s: t.string, m: t.number }),
  t.type({ s: t.string, m: t.number, ___0000_extra_: t.string }),
  t.partial({ s: t.string, m: t.number }),
  t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
  t.exact(t.type({ s: t.string, m: t.number })),
  t.exact(t.type({ s: t.string, m: t.number, ___0000_extra_: t.string })),
  t.exact(t.partial({ s: t.string, m: t.number })),
  t.exact(t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean })),
  t.exact(
    t.intersection([
      t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
      t.type({ s: t.string, j: t.boolean }),
    ])
  ),
  t.exact(
    t.intersection([
      t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
      t.type({ s2: t.string, j: t.boolean }),
    ])
  ),
  t.null,
  t.undefined,
  t.void,
  t.unknown,
  t.array(t.string),
  t.Int,
  t.literal('hello'),
  t.literal(34.4),
  t.literal(true),
  t.literal(''),
  t.literal(0),
  t.literal(false),
  t.keyof({
    _: null,
    this: null,
    0.3: null,
  }),
  t.tuple([t.number, t.string, t.boolean]),
  // Complex types
  t.intersection([
    t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.type({ s: t.string, j: t.boolean }),
  ]),
  t.intersection([
    t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.type({ s2: t.string, j: t.boolean }),
  ]),
  t.union([
    t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.type({ s: t.string, j: t.boolean }),
  ]),
  t.union([
    t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.type({ s2: t.string, j: t.boolean }),
  ]),
  t.intersection([
    t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.partial({ s: t.string, j: t.boolean }),
  ]),
  t.intersection([
    t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.partial({ s2: t.string, j: t.boolean }),
  ]),
  t.union([
    t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.partial({ s: t.string, j: t.boolean }),
  ]),
  t.union([
    t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
    t.partial({ s2: t.string, j: t.boolean }),
  ]),
  t.type({ s: t.string, m: t.type({ n: t.Int }) }),
  t.type({
    s: t.union([t.string, t.number, t.partial({ n: t.number, z: t.string })]),
    m: t.type({ n: t.number }),
  }),
];

const customStringDecoder: t.Decoder<unknown, string> = {
  name: 'customStringDecoder',
  decode: t.string.decode,
  validate: t.string.validate,
};

export interface WeirdStringBrand {
  readonly WeirdString: unique symbol;
}

const weirdString = t.brand(
  t.string,
  (a): a is t.Branded<string, WeirdStringBrand> => a.length > 4,
  'WeirdString'
);

export const unknownTypes = [
  weirdString,
  t.union([t.string, weirdString]),
  customStringDecoder,
];

export const runtimeFailTypes = [
  t.intersection([t.string, t.type({ m: t.number })]),
  t.intersection([t.type({ m: t.number }), t.string]),
];
