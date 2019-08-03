import * as assert from 'assert';
import * as lib from '../src/';

import * as t from 'io-ts';
import { exampleGenerator } from '../src/';
import { isRight } from 'fp-ts/lib/Either';

describe('io-ts-fuzzer', () => {
  const basicTypes = [
    t.number,
    t.string,
    t.boolean,
    t.union([t.string, t.number, t.boolean]),
  ];

  describe('correctly fuzzes', () => {
    for (const b of basicTypes) {
      describe(`\`${b.name}\` objects`, () => {
        const r = lib.createCoreRegistry()!;

        // tslint:disable-next-line:ban
        for (const n of [...Array(5).keys()]) {
          it(`for input ${n}`, () => {
            const p = exampleGenerator(r, b).encode;
            const v = p(n);
            assert.ok(isRight(b.decode(v)), `must decode ${v}`);
          });
        }
      });
    }
  });
});
