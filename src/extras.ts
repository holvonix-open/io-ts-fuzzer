import { Fuzzer } from './fuzzer';

async function loadExtras(str: string): Promise<Array<Fuzzer<unknown>>> {
  const x = (await import(`./extra-fuzzers/${str}`)) as {
    fuzzers: Array<Fuzzer<unknown>>;
  };
  return x.fuzzers;
}

export async function loadIoTsTypesFuzzers(): Promise<Array<Fuzzer<unknown>>> {
  return loadExtras('io-ts-types');
}
