import * as assert from 'assert';
import * as lib from '../src/registry';

import { types, unknownTypes } from './helpers';
import { Fuzzer } from '../src';
import * as t from 'io-ts';

describe('registry', () => {
  const fuzzStr1: Fuzzer<string, t.StringType> = {
    id: 'StringType',
    idType: 'tag',
    impl: {
      type: 'fuzzer',
      func: n => {
        return `Hello ${n}`;
      },
    },
  };
  const fuzzNum: Fuzzer<number, t.NumberType> = {
    id: 'NumberType',
    idType: 'tag',
    impl: {
      type: 'fuzzer',
      func: n => {
        return n + 1;
      },
    },
  };
  const fuzzStr2: Fuzzer<string, t.StringType> = {
    id: 'StringType',
    idType: 'tag',
    impl: {
      type: 'fuzzer',
      func: n => {
        return `Bye ${n}`;
      },
    },
  };

  describe('#createRegistry', () => {
    describe('#getFuzzer', () => {
      it(`has no fuzzers`, () => {
        for (const b of types) {
          assert.strictEqual(lib.createRegistry().getFuzzer(b), null);
        }
        for (const b of unknownTypes) {
          assert.strictEqual(lib.createRegistry().getFuzzer(b), null);
        }
      });
    });

    describe('#register', () => {
      it('registers a simple fuzzer', () => {
        const r = lib.createRegistry();
        assert.strictEqual(r.register(fuzzStr1), r);
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr1);
      });

      it('registers multiple distinct fuzzers sequentially', () => {
        const r = lib.createRegistry();
        assert.strictEqual(r.register(fuzzStr1), r);
        assert.strictEqual(r.register(fuzzNum), r);
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr1);
        assert.strictEqual(r.getFuzzer(t.number), fuzzNum);
      });

      it('registers multiple distinct fuzzers bulk', () => {
        const r = lib.createRegistry();
        assert.strictEqual(r.register(...([fuzzStr1, fuzzNum] as Fuzzer[])), r);
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr1);
        assert.strictEqual(r.getFuzzer(t.number), fuzzNum);
      });

      it('overrides 1st registration for 1 type with the 2nd across register calls', () => {
        let r = lib.createRegistry();
        assert.strictEqual(r.register(fuzzStr1), r);
        assert.strictEqual(r.register(fuzzStr2), r);
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr2);

        r = lib.createRegistry();
        assert.strictEqual(r.register(fuzzStr2), r);
        assert.strictEqual(r.register(fuzzStr1), r);
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr1);
      });

      it('overrides 1st registration for 1 type with the 2nd in one register call', () => {
        let r = lib.createRegistry();
        assert.strictEqual(
          r.register(fuzzStr1 as Fuzzer, fuzzStr2 as Fuzzer),
          r
        );
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr2);

        r = lib.createRegistry();
        assert.strictEqual(
          r.register(fuzzStr2 as Fuzzer, fuzzStr1 as Fuzzer),
          r
        );
        assert.strictEqual(r.getFuzzer(t.string), fuzzStr1);
      });
    });
  });

  describe('#createCoreRegistry', () => {
    describe('#getFuzzer', () => {
      for (const b of types) {
        it(`has a fuzzer for \`${b.name}\` type`, () => {
          const r = lib.createCoreRegistry().getFuzzer(b);
          assert.ok(r);
          const x = r!;
          assert.ok(x.idType === 'tag' || x.idType === 'name');
          if (x.idType === 'name') {
            assert.deepStrictEqual(x.id, b.name);
          } else {
            assert.deepStrictEqual(x.id, b._tag);
          }
        });
      }
    });

    describe('#exampleGenerator', () => {
      for (const b of types) {
        it(`can create an example generator for \`${b.name}\` type`, () => {
          const r = lib.createCoreRegistry().exampleGenerator(b);
          assert.ok(r);
        });
      }
    });
  });
});
