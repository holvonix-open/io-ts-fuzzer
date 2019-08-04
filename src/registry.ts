import { Fuzzer, ExampleGenerator, exampleGenerator } from './fuzzer';
import * as t from 'io-ts';
import { coreFuzzers } from './core/';

export interface Registry {
  register<T, U extends t.Decoder<unknown, T>>(v0: Fuzzer<T, U>): Registry;
  register(...vv: Fuzzer[]): Registry;

  exampleGenerator<T>(d: t.Decoder<unknown, T>): ExampleGenerator<T>;

  getFuzzer<T>(a: t.Decoder<unknown, T>): Fuzzer<T> | null;
}

type Key = string;

function fuzzerKey(f: Fuzzer): Key {
  return `${f.idType}/${f.id}`;
}

function decoderKeys(
  f: t.Decoder<unknown, unknown> & ({} | { _tag: string })
): Key[] {
  const ret: Key[] = [];
  ret.push(`name/${f.name}`);
  if ('_tag' in f) {
    ret.push(`tag/${f._tag}`);
  }
  return ret;
}

class RegistryC implements Registry {
  readonly fuzzers: Map<Key, Fuzzer> = new Map();

  readonly exampleGenerator: <T>(
    d: t.Decoder<unknown, T>
  ) => ExampleGenerator<T>;

  constructor() {
    this.exampleGenerator = exampleGenerator.bind(null, this) as <T>(
      d: t.Decoder<unknown, T>
    ) => ExampleGenerator<T>;
  }

  register<T, U extends t.Decoder<unknown, T>>(v0: Fuzzer<T, U>): Registry;
  register(...vv: Fuzzer[]) {
    for (const v of vv) {
      this.fuzzers.set(fuzzerKey(v), v);
    }
    return this;
  }

  getFuzzer<T>(a: t.Decoder<unknown, T>): Fuzzer<T> | null {
    const keys = decoderKeys(a);
    for (const c of keys) {
      const v = this.fuzzers.get(c);
      if (v) {
        return v as Fuzzer<T>;
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
  ret.register(...(coreFuzzers as Fuzzer[]));
  return ret;
}
