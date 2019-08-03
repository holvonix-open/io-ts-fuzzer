import * as assert from 'assert';
import * as lib from '../src/registry';

import * as t from 'io-ts';

describe('registry', () => {
  describe('#createCoreRegistry', () => {
    const basicTypes = [
      t.number,
      t.string,
      t.boolean,
      t.union([t.string, t.number, t.boolean]),
    ];

    describe('#getFuzzer', () => {
      for (const b of basicTypes) {
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
