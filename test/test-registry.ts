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

  describe('#fluent', () => {
    describe('#getFuzzer', () => {
      describe('on the core registry', () => {
        for (const b of types) {
          it(`has a fuzzer for \`${b.name}\` type`, () => {
            const r = lib.fluent(lib.createCoreRegistry()).getFuzzer(b);
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
        describe('on the core registry', () => {
          for (const b of types) {
            it(`can create an example generator for \`${b.name}\` type`, () => {
              const r = lib
                .fluent(lib.createCoreRegistry())
                .exampleGenerator(b);
              assert.ok(r);
            });
          }
        });
      });

      describe('#withArrayFuzzer', () => {
        describe('on the core registry', () => {
          it(`overrides the array fuzzer max length`, () => {
            const b = t.array(t.number);
            const r0 = lib.createCoreRegistry();
            const r = lib
              .fluent(r0)
              .withArrayFuzzer(3)
              .exampleGenerator(b);
            for (let i = 0; i < 100; i++) {
              assert.ok(r.encode(i).length <= 3);
            }
          });

          it(`overrides the partial object extra properties`, () => {
            const b = t.partial({ a: t.number });
            const r0 = lib.createCoreRegistry();
            const r = lib
              .fluent(r0)
              .withPartialFuzzer({ b: t.string })
              .exampleGenerator(b);
            const keys = new Set<string>();
            for (let i = 0; i < 10; i++) {
              Object.keys(r.encode(i)).map(x => keys.add(x));
            }
            assert.deepStrictEqual(keys.size, 2);
            assert.ok(keys.has('a'));
            assert.ok(keys.has('b'));
          });

          it(`overrides apply to the underlying registry`, () => {
            const b = t.array(t.number);
            const r0 = lib.createCoreRegistry();
            lib.fluent(r0).withArrayFuzzer(3);
            const r = r0.exampleGenerator(b);
            for (let i = 0; i < 100; i++) {
              assert.ok(r.encode(i).length <= 3);
            }
          });
        });
      });
    });
  });
});
