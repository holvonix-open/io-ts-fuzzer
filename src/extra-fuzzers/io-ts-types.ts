import { FuzzContext, concreteFuzzerByName } from '../fuzzer';
import { rngi } from '../rng';

export function fuzzDate(_: FuzzContext, n: number): Date {
  return new Date(rngi(n) / 1000.0);
}

export const fuzzers = [concreteFuzzerByName(fuzzDate, 'Date')];
