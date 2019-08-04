import * as assert from 'assert';
import * as lib from '../src/';

import { exampleGenerator } from '../src/';
import { isRight, Right } from 'fp-ts/lib/Either';
import { types } from './helpers';

const count = 103;

describe('io-ts-fuzzer', () => {
  describe('correctly fuzzes', () => {
    for (const b of types) {
      describe(`\`${b.name}\` objects`, () => {
        const r = lib.createCoreRegistry()!;

        it(`for inputs '[0, ${count})`, () => {
          // tslint:disable-next-line:ban
          for (const n of [...Array(count).keys()]) {
            const p = exampleGenerator(r, b).encode;
            const v = p(n);
            const d = b.decode(v);
            assert.ok(isRight(d), `must decode ${JSON.stringify(v)}`);
            assert.deepStrictEqual(
              (d as Right<unknown>).right,
              v,
              `must decode ${JSON.stringify(v)}`
            );
          }
        });
      });
    }
  });
});
