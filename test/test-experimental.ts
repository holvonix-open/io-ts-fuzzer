import * as assert from 'assert';
import * as lib from '../src/experimental';

import {
  exampleGenerator,
  fuzzContext,
  FuzzContext,
  createCoreRegistry,
  Fuzzer,
} from '../src/';
import * as t from 'io-ts';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';
import { Encode } from 'io-ts';
import { rngi } from '../src/rng';
import { isRight, Right } from 'fp-ts/lib/Either';

const count = 100;

// tslint:disable-next-line:no-any
const types: Array<t.Type<any>> = [
  nonEmptyArray(t.string),
  nonEmptyArray(t.union([t.string, t.number])),
  t.partial({ a: nonEmptyArray(t.string) }),
  t.type({ a: nonEmptyArray(t.string) }),
  t.partial({ a: nonEmptyArray(t.union([t.string, t.number])) }),
  t.type({ a: nonEmptyArray(t.union([t.string, t.number])) }),
  t.type({ a: nonEmptyArray(t.union([t.string, t.number])) }),
  nonEmptyArray(t.type({ a: nonEmptyArray(t.union([t.string, t.number])) })),
];

describe('experimental', () => {
  describe('nonEmptyArrayFuzzer', () => {
    for (const b of types) {
      describe(`\`${b.name}\` codec`, () => {
        let p: Encode<[number, FuzzContext], unknown>;
        const old: unknown[] = [];
        it(`loads extra fuzzers and builds an example generator`, async () => {
          const r = createCoreRegistry()!;
          const fz: Fuzzer[] = [
            lib.nonEmptyArrayFuzzer(t.string),
            lib.nonEmptyArrayFuzzer(t.union([t.string, t.number])),
            lib.nonEmptyArrayFuzzer(
              t.type({ a: nonEmptyArray(t.union([t.string, t.number])) })
            ),
          ] as Fuzzer[];
          r.register(...fz);
          p = exampleGenerator(r, b).encode;
        });
        it(`generates decodable examples for seeds '[0, ${count})`, () => {
          for (const n of new Array(count).keys()) {
            const v = p([rngi(n) / Math.PI, fuzzContext()]);
            const d = b.decode(v);
            assert.ok(
              isRight(d),
              `must decode ${JSON.stringify(v)}, instead ${JSON.stringify(d)}`
            );
            old.push(v);
            const y = b.encode((d as Right<unknown>).right);
            // can't use deepStrictEqual because io-ts uses {...X} to encode
            // certain objects, thus they don't have null prototypes.
            // tslint:disable-next-line:deprecation
            assert.deepEqual(y, v, `must encode back to ${JSON.stringify(v)}`);
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
}).timeout(1000000);
