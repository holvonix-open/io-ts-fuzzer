import { assert } from 'chai';
import * as t from 'io-ts';

import { fuzzUnion, unknownFuzzer } from '../src/core';
import { fuzzContext, FuzzerUnit, Fuzzer } from '../src/fuzzer';

// tslint:disable-next-line:variable-name
const RecA: t.RecursiveType<t.UnionType<t.Mixed[]>> = t.recursion('RecA', () =>
  t.union([t.number, t.string, RecA])
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

const count = 100;

const fuNumber: FuzzerUnit<number> = {
  mightRecurse: false,
  encode: () => 10,
};

const fuString: FuzzerUnit<string> = {
  mightRecurse: false,
  encode: () => '15',
};

const fuNumberRecursive: FuzzerUnit<number> = {
  mightRecurse: true,
  encode: () => 10,
};

const fuStringRecursive: FuzzerUnit<string> = {
  mightRecurse: true,
  encode: () => '15',
};

const ro = {};

const fuRecursiveObject: FuzzerUnit<object> = {
  mightRecurse: true,
  encode: () => ro,
};

const fuNonRecursiveObject: FuzzerUnit<object> = {
  mightRecurse: false,
  encode: () => ro,
};

describe('core', () => {
  describe('fuzzUnion', () => {
    it('returns any subtype when mayRecurse', () => {
      const c = fuzzUnion(RecA.type);
      const s = new Set<unknown>();
      for (const i of new Array(count).keys()) {
        s.add(
          c.func(
            fuzzContext({ maxRecursionHint: 1 }),
            i,
            fuNumber,
            fuString,
            fuRecursiveObject
          )
        );
      }
      assert.sameMembers(Array.from(s), [10, '15', ro]);
    });

    it('returns any subtype when !mayRecurse and no recursive types', () => {
      const c = fuzzUnion(RecA.type);
      const s = new Set<unknown>();
      for (const i of new Array(count).keys()) {
        s.add(
          c.func(
            fuzzContext({ maxRecursionHint: 0 }),
            i,
            fuNumber,
            fuString,
            fuNonRecursiveObject
          )
        );
      }
      assert.sameMembers(Array.from(s), [10, '15', ro]);
    });

    it('returns available non-recursive subtypes when !mayRecurse', () => {
      const c = fuzzUnion(RecA.type);
      const s = new Set<unknown>();
      for (const i of new Array(count).keys()) {
        s.add(
          c.func(
            fuzzContext({ maxRecursionHint: 0 }),
            i,
            fuNumber,
            fuString,
            fuRecursiveObject
          )
        );
      }
      assert.sameMembers(Array.from(s), [10, '15']);
    });

    it('returns any subtype when !mayRecurse and no non-recursive subtypes', () => {
      const c = fuzzUnion(RecA.type);
      const s = new Set<unknown>();
      for (const i of new Array(count).keys()) {
        s.add(
          c.func(
            fuzzContext({ maxRecursionHint: 0 }),
            i,
            fuNumberRecursive,
            fuStringRecursive,
            fuRecursiveObject
          )
        );
      }
      assert.sameMembers(Array.from(s), [10, '15', ro]);
    });
  });

  describe('fuzzUnknownWithType', () => {
    it('uses configured replacement when depth=1', () => {
      const c0 = unknownFuzzer(t.string) as Fuzzer<unknown>;
      if (c0.impl.type !== 'generator') {
        throw new Error();
      }
      const c = c0.impl.func(t.unknown);
      const s = new Set<unknown>();
      const childDeeper = new Set<boolean>();
      const fuStringSpy: FuzzerUnit<string> = {
        mightRecurse: false,
        encode: ctx => {
          childDeeper.add(ctx[1].mayRecurse());
          return '15';
        },
      };
      for (const i of new Array(count).keys()) {
        s.add(c.func(fuzzContext({ maxRecursionHint: 1 }), i, fuStringSpy));
      }
      assert.sameMembers(Array.from(s), ['15']);
      assert.sameMembers(Array.from(childDeeper), [false]);
    });

    it('uses configured replacement when depth=2', () => {
      const c0 = unknownFuzzer(t.string) as Fuzzer<unknown>;
      if (c0.impl.type !== 'generator') {
        throw new Error();
      }
      const c = c0.impl.func(t.unknown);
      const s = new Set<unknown>();
      const childDeeper = new Set<boolean>();
      const fuStringSpy: FuzzerUnit<string> = {
        mightRecurse: false,
        encode: ctx => {
          childDeeper.add(ctx[1].mayRecurse());
          return '15';
        },
      };
      for (const i of new Array(count).keys()) {
        s.add(c.func(fuzzContext({ maxRecursionHint: 2 }), i, fuStringSpy));
      }
      assert.sameMembers(Array.from(s), ['15']);
      assert.sameMembers(Array.from(childDeeper), [true]);
    });

    it('returns default value when !mayRecurse', () => {
      const c0 = unknownFuzzer(t.string) as Fuzzer<unknown>;
      if (c0.impl.type !== 'generator') {
        throw new Error();
      }
      const c = c0.impl.func(t.unknown);
      const s = new Set<unknown>();
      for (const i of new Array(count).keys()) {
        s.add(c.func(fuzzContext({ maxRecursionHint: 0 }), i, fuString));
      }
      assert.ok(Array.from(s).findIndex(x => typeof x !== 'number') === -1);
    });
  });
});
