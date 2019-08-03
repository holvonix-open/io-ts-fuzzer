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
            // tslint:disable-next-line:no-any
            const p = exampleGenerator<any>(r, b).encode;
            const v = p(n);
            // tslint:disable-next-line:no-any
            const d = b.decode(v) as any;
            assert.ok(isRight(d), `must decode ${JSON.stringify(v)}`);
            assert.deepStrictEqual(
              // tslint:disable-next-line:no-any
              (d as Right<any>).right,
              v,
              `must decode ${JSON.stringify(v)}`
            );
          }
        });
      });
    }
  });
});
