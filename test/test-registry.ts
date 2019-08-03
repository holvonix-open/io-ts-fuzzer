import * as assert from 'assert';
import * as lib from '../src/registry';

import { types } from './helpers';

describe('registry', () => {
  describe('#createCoreRegistry', () => {
    describe('#getFuzzer', () => {
      for (const b of types) {
        it(`has a fuzzer for \`${b.name}\` type`, () => {
          const r = lib.createCoreRegistry().getFuzzer(b);
          assert.ok(r);
          const x = r!;
          assert.deepStrictEqual(x.idType, 'tag');
          assert.deepStrictEqual(x.id, b._tag);
        });
      }
    });
  });
});
