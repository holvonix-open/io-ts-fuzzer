import {
  FuzzContext,
  concreteFuzzerByName,
  FuzzerUnit,
  ImmediateConcreteFuzzer,
  fuzzerByName,
} from '../fuzzer';
import { rngi, rng } from '../rng';

import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import { date } from 'io-ts-types/lib/date';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { DateFromNumber } from 'io-ts-types/lib/DateFromNumber';
import { DateFromUnixTime } from 'io-ts-types/lib/DateFromUnixTime';
import { BooleanFromString } from 'io-ts-types/lib/BooleanFromString';
import { IntFromString } from 'io-ts-types/lib/IntFromString';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

function decode<A1, U, I1>(t: t.Type<A1, U, I1>, v: I1): A1 {
  const d = t.decode(v);
  // istanbul ignore else
  if (isRight(d)) {
    return d.right;
  } else {
    throw new Error('IOTSF0003: cannot decode piped fuzzer output');
  }
}

function pipeFuzzer<A1, I1, V, U, T>(
  t: t.Type<A1, U, I1>,
  e: t.Encode<A1, V>
): ImmediateConcreteFuzzer<T, V> {
  return {
    type: 'fuzzer',
    mightRecurse: false,
    children: [t],
    func: (ctx, n, h0) => {
      return e(decode(t, (h0 as FuzzerUnit<I1>).encode([rngi(n), ctx])));
    },
  };
}

export function fuzzDate(_: FuzzContext, n: number): Date {
  return new Date(rngi(n) / 1000.0);
}

export function fuzzUUID(_: FuzzContext, n: number): string {
  const r = rng(n);
  const ret: string[] = [];
  for (const i of new Array(32).keys()) {
    switch (i) {
      case 8:
      case 12:
      case 16:
      case 20:
        ret.push('-');
        break;
      default:
      // nothing
    }
    ret.push((Math.abs(r.int32()) % 16).toString(16));
  }
  return ret.join('');
}

export function fuzzRegExp(i: string): RegExp {
  return new RegExp(i);
}

export const fuzzers = [
  concreteFuzzerByName(fuzzDate, 'Date'),
  fuzzerByName(
    pipeFuzzer(t.boolean, BooleanFromString.encode),
    'BooleanFromString'
  ),
  fuzzerByName(pipeFuzzer(date, DateFromISOString.encode), 'DateFromISOString'),
  fuzzerByName(pipeFuzzer(date, DateFromNumber.encode), 'DateFromNumber'),
  fuzzerByName(
    pipeFuzzer(date, x => Math.floor(DateFromUnixTime.encode(x))),
    'DateFromUnixTime'
  ),
  fuzzerByName(pipeFuzzer(t.Int, IntFromString.encode), 'IntFromString'),
  fuzzerByName(pipeFuzzer(t.string, x => `n${x}`), 'NonEmptyString'),
  fuzzerByName(
    pipeFuzzer(t.number, NumberFromString.encode),
    'NumberFromString'
  ),
  concreteFuzzerByName(fuzzUUID, 'UUID'),
  fuzzerByName(pipeFuzzer(t.string, fuzzRegExp), 'RegExp'),
];
