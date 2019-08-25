import * as t from 'io-ts';

// tslint:disable-next-line:variable-name
const RecA: t.Type<unknown> = t.recursion('RecA', () =>
  t.union([t.number, RecA])
);

interface RecB {
  next: number | RecB;
}

// tslint:disable-next-line:variable-name
const RecB: t.Type<RecB> = t.recursion('RecB', () =>
  t.type({
    next: t.union([RecB, t.number]),
  })
);
// tslint:disable-next-line:class-name
interface RecB_Partial {
  next?: RecB_Partial;
}
// tslint:disable-next-line:variable-name
const RecB_Partial: t.Type<Partial<RecB_Partial>> = t.recursion(
  'RecB_Partial',
  () =>
    t.partial({
      next: RecB_Partial,
    })
);
// tslint:disable-next-line:class-name
interface RecC1_MutualRecursion {
  c1: number | RecC1_MutualRecursion;
  next: undefined | RecC2_MutualRecursion;
}
// tslint:disable-next-line:class-name
interface RecC2_MutualRecursion {
  c2: string | RecC2_MutualRecursion;
  next: undefined | RecC1_MutualRecursion;
}
// tslint:disable-next-line:variable-name
const RecC1_MutualRecursion: t.Type<RecC1_MutualRecursion> = t.recursion(
  'RecC1_MutualRecursion',
  () =>
    t.type({
      c1: t.union([t.number, RecC1_MutualRecursion]),
      next: t.union([t.undefined, RecC2_MutualRecursion]),
    })
);
// tslint:disable-next-line:variable-name
const RecC2_MutualRecursion: t.Type<RecC2_MutualRecursion> = t.recursion(
  'RecC2_MutualRecursion',
  () =>
    t.type({
      c2: t.union([t.string, RecC2_MutualRecursion]),
      next: t.union([t.undefined, RecC1_MutualRecursion]),
    })
);
// tslint:disable-next-line:class-name
interface RecE1_ArrayOfRecursion {
  next: RecE1_ArrayOfRecursion[];
}
// tslint:disable-next-line:variable-name
const RecE1_ArrayOfRecursion: t.Type<RecE1_ArrayOfRecursion> = t.recursion(
  'RecE1_ArrayOfRecursion',
  () =>
    t.type({
      next: t.array(RecE1_ArrayOfRecursion),
    })
);
// tslint:disable-next-line:class-name
interface RecD1_MutualRecursionReadonlyArray {
  c1: number | RecD1_MutualRecursionReadonlyArray;
  next: ReadonlyArray<RecD2_MutualRecursionArray>;
}
// tslint:disable-next-line:class-name
interface RecD2_MutualRecursionArray {
  c2: string | RecD2_MutualRecursionArray;
  next: undefined | RecD1_MutualRecursionReadonlyArray;
}
// tslint:disable-next-line:variable-name
const RecD1_MutualRecursionReadonlyArray: t.Type<
  RecD1_MutualRecursionReadonlyArray
> = t.recursion('RecD1_MutualRecursionReadonlyArray', () =>
  t.type({
    c1: t.union([t.number, RecD1_MutualRecursionReadonlyArray]),
    next: t.readonlyArray(RecD2_MutualRecursionArray),
  })
);
// tslint:disable-next-line:variable-name
const RecD2_MutualRecursionArray: t.Type<
  RecD2_MutualRecursionArray
> = t.recursion('RecD2_MutualRecursionArray', () =>
  t.type({
    c2: t.union([t.string, RecD2_MutualRecursionArray]),
    next: t.union([t.undefined, RecD1_MutualRecursionReadonlyArray]),
  })
);

// tslint:disable-next-line:class-name
interface RecE2_RecordOfRecursion {
  rr: Record<'a' | 'b' | 'c' | 'd' | 'e', RecE2_RecordOfRecursion>;
}
// tslint:disable-next-line:variable-name
const RecE2_RecordOfRecursion: t.Type<RecE2_RecordOfRecursion> = t.recursion(
  'RecE2_RecordOfRecursion',
  () =>
    t.type({
      rr: t.record(
        t.keyof({ a: null, b: null, c: null, d: null, e: null }),
        RecE2_RecordOfRecursion
      ),
    })
);

// tslint:disable-next-line:no-any
export const types: Array<t.Type<any>> = [
  // Recursive types
  RecA,
  RecB,
  RecB_Partial,
  RecC1_MutualRecursion,
  RecC2_MutualRecursion,
  RecE1_ArrayOfRecursion,
  RecD1_MutualRecursionReadonlyArray,
  RecD2_MutualRecursionArray,
  RecE2_RecordOfRecursion,
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
  t.null,
  t.undefined,
  t.void,
  t.unknown,
  t.array(t.string),
  t.readonlyArray(t.string),
  t.UnknownArray,
  t.array(t.partial({ s: t.string, m: t.number })),
  t.readonlyArray(t.partial({ s: t.string, m: t.number })),
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
  t.readonly(t.string),
  t.readonly(t.tuple([t.string, t.boolean])),
  t.readonly(t.type({ s: t.string, j: t.boolean })),

  t.UnknownRecord,
  t.record(t.string, t.number),
  t.record(t.keyof({ 3: null, b: null, true: null }), t.number),
  // Complex nested types
  t.record(
    t.string,
    t.union([
      t.readonly(
        t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean })
      ),
      t.readonly(t.partial({ s2: t.string, j: t.boolean })),
    ])
  ),
  t.record(
    t.string,
    t.union([
      t.readonly(
        t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean })
      ),
      t.readonly(t.partial({ s2: t.string, j: t.boolean })),
    ])
  ),
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
  t.readonly(
    t.intersection([
      t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
      t.type({ s: t.string, j: t.boolean }),
    ])
  ),
  t.exact(
    t.intersection([
      t.readonly(
        t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean })
      ),
      t.type({ s2: t.string, j: t.boolean, rec: RecC1_MutualRecursion }),
    ])
  ),
  t.exact(
    t.intersection([
      t.type({ s: t.string, m: t.number, ___0000_extra_: t.boolean }),
      t.readonly(t.type({ s2: t.string, j: t.boolean })),
    ])
  ),
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
  t.union([
    t.readonly(
      t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean })
    ),
    t.readonly(t.partial({ s: t.string, j: t.boolean })),
  ]),
  t.union([
    t.readonly(
      t.partial({ s: t.string, m: t.number, ___0000_extra_: t.boolean })
    ),
    t.readonly(t.partial({ s2: t.string, j: t.boolean })),
  ]),
  t.union([
    t.readonly(t.partial({ s: t.string, m: t.number })),
    t.readonly(t.partial({ s2: t.string, j: t.boolean })),
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

export const unknownTypes: Array<t.Decoder<unknown, unknown>> = [
  weirdString,
  t.union([t.string, weirdString]),
  customStringDecoder,
];

export const runtimeFailTypes = [
  t.record(t.number, t.number),
  t.record(t.type({ m: t.number }), t.number),
  t.record(t.boolean, t.number),
  t.intersection([t.string, t.type({ m: t.number })]),
  t.intersection([t.type({ m: t.number }), t.string]),
];
