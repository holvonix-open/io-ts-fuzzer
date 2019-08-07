import * as assert from 'assert';
import * as lib from '../../src/extras';

import {
  exampleGenerator,
  fuzzContext,
  FuzzContext,
  createCoreRegistry,
} from '../../src/';
import { isRight, Right } from 'fp-ts/lib/Either';
import { date } from 'io-ts-types/lib/date';
import { Encode } from 'io-ts';

const count = 100;

const types = [date];

describe('extra-fuzzers', () => {
  describe('io-ts-types', () => {
    for (const b of types) {
      describe(`\`${b.name}\` codec`, () => {
        let p: Encode<[number, FuzzContext], unknown>;
        const old: unknown[] = [];
        it(`loads extra fuzzers and builds an example generator`, async () => {
          const r = createCoreRegistry()!;
          const fz = await lib.loadIoTsTypesFuzzers();
          r.register(...fz);
          p = exampleGenerator(r, b).encode;
        });
        it(`generates unique, decodable examples for inputs '[0, ${count})`, () => {
          for (const n of new Array(count).keys()) {
            const v = p([n, fuzzContext()]);
            const d = b.decode(v);
            assert.ok(isRight(d), `must decode ${JSON.stringify(v)}`);
            assert.deepStrictEqual(
              (d as Right<unknown>).right,
              v,
              `must decode ${JSON.stringify(v)}`
            );
            old.push(v);
          }
        })
          .timeout(5000)
          .slow(500);
        it(`generates same examples 2nd time`, () => {
          for (const n of new Array(count).keys()) {
            const v = p([n, fuzzContext()]);
            assert.deepStrictEqual(v, old[n]);
          }
        })
          .timeout(5000)
          .slow(500);
      });
    }
  });
});
