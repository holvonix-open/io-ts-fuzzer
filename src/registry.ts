import { Fuzzer, ExampleGenerator, exampleGenerator } from './fuzzer';
import * as t from 'io-ts';
import {
  partialFuzzer,
  interfaceFuzzer,
  readonlyArrayFuzzer,
  anyArrayFuzzer,
  unknownFuzzer,
  arrayFuzzer,
  coreFuzzers,
  recordFuzzer,
  unknownRecordFuzzer,
} from './core';

export interface Registry {
  register<T, U, C extends t.Decoder<U, T>>(v0: Fuzzer<T, U, C>): Registry;
  register(...vv: Fuzzer[]): Registry;

  exampleGenerator<T, U>(d: t.Decoder<U, T>): ExampleGenerator<U>;

  getFuzzer<T, U>(a: t.Decoder<U, T>): Fuzzer<T, U> | null;
}

export interface FluentRegistry extends Registry {
  withUnknownFuzzer(codec?: t.Decoder<unknown, unknown>): FluentRegistry;
  withArrayFuzzer(maxLength?: number): FluentRegistry;
  withAnyArrayFuzzer(maxLength?: number): FluentRegistry;
  withRecordFuzzer(maxCount?: number): FluentRegistry;
  withUnknownRecordFuzzer(maxCount?: number): FluentRegistry;
  withReadonlyArrayFuzzer(maxLength?: number): FluentRegistry;
  withPartialFuzzer(extra?: t.Props): FluentRegistry;
  withInterfaceFuzzer(extra?: t.Props): FluentRegistry;
}

class FluentifiedRegistry implements FluentRegistry {
  private readonly pimpl: Registry;
  constructor(pimpl: Registry) {
    this.pimpl = pimpl;
  }

  register<T, U, C extends t.Decoder<U, T>>(v0: Fuzzer<T, U, C>): Registry;
  register(...vv: Fuzzer[]): FluentRegistry {
    this.pimpl.register(...vv);
    return this;
  }

  exampleGenerator<T, U>(d: t.Decoder<U, T>): ExampleGenerator<U> {
    return this.pimpl.exampleGenerator(d);
  }

  getFuzzer<T, U>(a: t.Decoder<U, T>): Fuzzer<T, U> | null {
    return this.pimpl.getFuzzer(a);
  }

  withUnknownFuzzer(codec?: t.Decoder<unknown, unknown>): FluentRegistry {
    this.register(unknownFuzzer(codec));
    return this;
  }

  withArrayFuzzer(maxLength?: number): FluentRegistry {
    this.register(arrayFuzzer(maxLength));
    return this;
  }

  withAnyArrayFuzzer(maxLength?: number): FluentRegistry {
    this.register(anyArrayFuzzer(maxLength));
    return this;
  }

  withRecordFuzzer(maxCount?: number): FluentRegistry {
    this.register(recordFuzzer(maxCount));
    return this;
  }

  withUnknownRecordFuzzer(maxCount?: number): FluentRegistry {
    this.register(unknownRecordFuzzer(maxCount));
    return this;
  }

  withReadonlyArrayFuzzer(maxLength?: number): FluentRegistry {
    this.register(readonlyArrayFuzzer(maxLength));
    return this;
  }

  withPartialFuzzer(extra?: t.Props): FluentRegistry {
    this.register(partialFuzzer(extra));
    return this;
  }

  withInterfaceFuzzer(extra?: t.Props): FluentRegistry {
    this.register(interfaceFuzzer(extra));
    return this;
  }
}

export function fluent(r: Registry): FluentRegistry {
  return new FluentifiedRegistry(r);
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

  readonly exampleGenerator: <T, U>(d: t.Decoder<U, T>) => ExampleGenerator<U>;

  constructor() {
    this.exampleGenerator = exampleGenerator.bind(null, this) as <T, U>(
      d: t.Decoder<U, T>
    ) => ExampleGenerator<U>;
  }

  register(...vv: Fuzzer[]) {
    for (const v of vv) {
      this.fuzzers.set(fuzzerKey(v), v);
    }
    return this;
  }

  getFuzzer<T, U>(a: t.Decoder<U, T>): Fuzzer<T, U> | null {
    const keys = decoderKeys(a as t.Decoder<unknown, T>);
    for (const c of keys) {
      const v = this.fuzzers.get(c);
      if (v) {
        return v as Fuzzer<T, U>;
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
