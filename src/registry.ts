import { Fuzzer } from './fuzzer';
import * as t from 'io-ts';
import { coreFuzzers } from './core/';

export interface Registry {
  // tslint:disable-next-line:no-any
  register(...vv: Array<Fuzzer<any, t.Decoder<unknown, any>>>): void;

  getFuzzer<T>(
    a: t.Decoder<unknown, T>
  ): Fuzzer<T, t.Decoder<unknown, T>> | null;
}

type Key = string;

function fuzzerKey(f: Fuzzer<unknown, t.Decoder<unknown, unknown>>): Key {
  return `${f.idType}/${f.id}`;
}

function decoderKeys(f: t.Decoder<unknown, unknown> | { _tag: string }): Key[] {
  const ret: Key[] = [];
  if ('name' in f) {
    ret.push(`name/${f.name}`);
  }
  if ('_tag' in f) {
    ret.push(`tag/${f._tag}`);
  }
  return ret;
}

class RegistryC implements Registry {
  readonly fuzzers: Map<
    Key,
    // tslint:disable-next-line:no-any
    Fuzzer<any, t.Decoder<unknown, unknown>>
  > = new Map();

  // tslint:disable-next-line:no-any
  register(...vv: Array<Fuzzer<any, t.Decoder<unknown, any>>>) {
    for (const v of vv) {
      this.fuzzers.set(fuzzerKey(v), v);
    }
  }

  getFuzzer<T>(a: t.Decoder<unknown, T>) {
    const keys = decoderKeys(a);

    for (const c of keys) {
      const v = this.fuzzers.get(c);
      if (v) {
        return v;
      }
    }
    return null;
  }
}

export function createRegistry(): Registry {
  return new RegistryC();
}

export function createCoreRegistry(): Registry {
  const ret = createRegistry();
  // tslint:disable-next-line:no-any
  ret.register(...(coreFuzzers as Array<Fuzzer<any, t.Decoder<unknown, any>>>));
  return ret;
}
