import * as t from 'io-ts';
import * as fuzz from 'io-ts-fuzzer';

// Fuzzers for common types
const r = fuzz.createCoreRegistry();

// Type to fuzz
const target = t.union([t.string, t.type({ n: t.number, b: t.boolean })]);

// Builds a particular fuzzer from the registry.
const fuzzer = fuzz.exampleGenerator(r, target);

// Make examples. The input integer and context
// fully determines the output example.
for (const n of new Array(10).keys()) {
  console.log(JSON.stringify(fuzzer.encode([n, fuzz.fuzzContext()])));
}
