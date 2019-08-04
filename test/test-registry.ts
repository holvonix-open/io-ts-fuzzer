import * as assert from 'assert';
import * as lib from '../src/registry';

import { types, unknownTypes } from './helpers';
import { Fuzzer } from '../src';
import * as t from 'io-ts';

describe('registry', () => {
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

    describe('#exampleGenerator', () => {
      for (const b of types) {
        it(`can create an example generator for \`${b.name}\` type`, () => {
          const r = lib.createCoreRegistry().exampleGenerator(b);
          assert.ok(r);
        });
      }
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
