import * as t from 'io-ts';

export const types = [
  // Simple 0- or 1-depth types
  t.number,
  t.string,
  t.boolean,
  t.union([t.string, t.number, t.boolean]),
  t.intersection([t.type({ s: t.string }), t.type({ m: t.number })]),
  t.type({ s: t.string, m: t.number }),
  t.partial({ s: t.string, m: t.number }),
  t.null,
  t.undefined,
  t.void,
  t.unknown,
  t.array(t.string),

  // Complex types
  t.type({ s: t.string, m: t.type({ n: t.number }) }),
  t.type({
    s: t.union([t.string, t.number, t.partial({ n: t.number, z: t.string })]),
    m: t.type({ n: t.number }),
  }),
];
