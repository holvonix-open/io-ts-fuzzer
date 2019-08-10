import { Fuzzer } from './fuzzer';
import * as t from 'io-ts';
import { NonEmptyArray, cons } from 'fp-ts/lib/NonEmptyArray';

/**
 * @experimental 4.1.0 This will be superseded by a generic handler for NonEmptyArrays in io-ts-types when https://github.com/gcanti/io-ts-types/issues/102 is fixed.
 */
export const nonEmptyArrayFuzzer = <T>(
  c: t.Type<T, unknown>
): Fuzzer<NonEmptyArray<T>, unknown> => ({
  id: `NonEmptyArray<${c.name}>`,
  idType: 'name',
  impl: {
    type: 'fuzzer',
    children: [c, t.array(c)],
    func: (ctx, n0, hc, ha) => {
      return cons(hc.encode([n0, ctx]) as T, ha.encode([n0, ctx]) as T[]);
    },
  },
});
