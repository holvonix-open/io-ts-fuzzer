import * as assert from 'assert';
import * as lib from '../../src/extras';

import {
  exampleGenerator,
  fuzzContext,
  FuzzContext,
  createCoreRegistry,
} from '../../src/';
import * as t from 'io-ts';
import { isRight, Right } from 'fp-ts/lib/Either';
import { date } from 'io-ts-types/lib/date';
import { BooleanFromString } from 'io-ts-types/lib/BooleanFromString';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { DateFromNumber } from 'io-ts-types/lib/DateFromNumber';
import { DateFromUnixTime } from 'io-ts-types/lib/DateFromUnixTime';
import { IntFromString } from 'io-ts-types/lib/IntFromString';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';
import { UUID } from 'io-ts-types/lib/UUID';
import { either } from 'io-ts-types/lib/either';
import { option } from 'io-ts-types/lib/option';
import { regexp } from 'io-ts-types/lib/regexp';
import { Encode } from 'io-ts';
import { rngi } from '../../src/rng';

const count = 100;

// tslint:disable-next-line:no-any
const types: Array<t.Type<any>> = [
  date,
  BooleanFromString,
  DateFromISOString,
  DateFromNumber,
  DateFromUnixTime,
  IntFromString,
  NonEmptyString,
  NumberFromString,
  UUID,
  either(t.string, t.number),
  option(t.string),
  regexp,
];

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
        it(`generates decodable examples for seeds '[0, ${count})`, () => {
          for (const n of new Array(count).keys()) {
            const v = p([rngi(n) / Math.PI, fuzzContext()]);
            const d = b.decode(v);
            assert.ok(isRight(d), `must decode ${JSON.stringify(v)}`);
            assert.deepStrictEqual(
              b.encode((d as Right<unknown>).right),
              v,
              `must encode back to ${JSON.stringify(v)}`
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
