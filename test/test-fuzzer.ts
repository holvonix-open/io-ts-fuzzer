import * as assert from 'assert';
import * as lib from '../src/fuzzer';

import { types, unknownTypes, runtimeFailTypes } from './helpers';
import { createCoreRegistry } from '../src/registry';
import { isRight } from 'fp-ts/lib/Either';
import { inspect } from 'util';

describe('fuzzer', () => {
  describe('#exampleGenerator', () => {
    for (const b of types) {
      it(`can build a fuzzer for \`${b.name}\` type`, () => {
        const r = createCoreRegistry();
        assert.ok(lib.exampleGenerator(r, b));
      });
    }
    for (const b of runtimeFailTypes) {
      it(`can build a fuzzer for \`${b.name}\` type`, () => {
        const r = createCoreRegistry();
        assert.ok(lib.exampleGenerator(r, b));
      });
    }
    for (const b of unknownTypes) {
      it(`throws on unknown \`${b.name}\` type`, () => {
        const r = createCoreRegistry();
        assert.throws(() => lib.exampleGenerator(r, b));
      });
    }
  });

  describe('#exampleOf', () => {
    for (const b of types) {
      it(`can fuzz \`${b.name}\` type`, () => {
        const r = createCoreRegistry();
        const ex = lib.exampleOf(b, r, 0);
        assert.ok(isRight(b.decode(ex)), inspect(ex));
      });
    }
    for (const b of runtimeFailTypes) {
      it(`throws on fuzzing \`${b.name}\` type`, () => {
        const r = createCoreRegistry();
        assert.throws(() => lib.exampleOf(b, r, 0));
      });
    }
    for (const b of unknownTypes) {
      it(`throws on unknown \`${b.name}\` type`, () => {
        const r = createCoreRegistry();
        assert.throws(() => lib.exampleOf(b, r, 0));
      });
    }
  });
});
