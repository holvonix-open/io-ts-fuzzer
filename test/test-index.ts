import { assert } from 'chai';
import * as lib from '../src/';

import { exampleGenerator, fuzzContext } from '../src/';
import { isRight, Right } from 'fp-ts/lib/Either';
import { types } from './tested-types';
import { Encode } from 'io-ts';
import { rngi } from '../src/rng';

const count = 100;

describe('io-ts-fuzzer', () => {
  describe('fuzzer', () => {
    for (const b of types) {
      describe(`\`${b.name}\` codec`, () => {
        let p: Encode<[number, lib.FuzzContext], unknown>;
        const old: unknown[] = [];
        it(`builds an example generator`, () => {
          const r = lib.createCoreRegistry()!;
          p = exampleGenerator(r, b).encode;
        });
        it(`generates decodable examples for seeds '[0, ${count})`, () => {
          for (const n of new Array(count).keys()) {
            const v = p([rngi(n) / Math.PI, fuzzContext()]);
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
            const v = p([rngi(n) / Math.PI, fuzzContext()]);
            assert.deepStrictEqual(v, old[n]);
          }
        })
          .timeout(5000)
          .slow(500);
      });
    }
  });
});
