import * as assert from 'assert';
import * as lib from '../src/';

import * as t from 'io-ts';
import { exampleGenerator } from '../src/';
import { isRight, Right } from 'fp-ts/lib/Either';

describe('io-ts-fuzzer', () => {
  const types = [
    // Simple 0- or 1-depth types
    t.number,
    t.string,
    t.boolean,
    t.union([t.string, t.number, t.boolean]),
    t.type({ s: t.string, m: t.number }),
    t.partial({ s: t.string, m: t.number }),

    // Complex types
    t.type({ s: t.string, m: t.type({ n: t.number }) }),
    t.type({
      s: t.union([t.string, t.number, t.partial({ n: t.number, z: t.string })]),
      m: t.type({ n: t.number }),
    }),
  ];

  describe('correctly fuzzes', () => {
    for (const b of types) {
      describe(`\`${b.name}\` objects`, () => {
        const r = lib.createCoreRegistry()!;

        // tslint:disable-next-line:ban
        for (const n of [...Array(100).keys()]) {
          it(`for input ${n}`, () => {
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
          });
        }
      });
    }
  });
});
