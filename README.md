# io-ts-fuzzer - Fuzzing for io-ts codecs and types

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE) [![npm](https://img.shields.io/npm/v/io-ts-fuzzer.svg)](https://www.npmjs.com/package/io-ts-fuzzer) [![Build Status](https://travis-ci.com/holvonix-open/io-ts-fuzzer.svg?branch=master)](https://travis-ci.com/holvonix-open/io-ts-fuzzer) [![GitHub last commit](https://img.shields.io/github/last-commit/holvonix-open/io-ts-fuzzer.svg)](https://github.com/holvonix-open/io-ts-fuzzer/commits) [![codecov](https://codecov.io/gh/holvonix-open/io-ts-fuzzer/branch/master/graph/badge.svg)](https://codecov.io/gh/holvonix-open/io-ts-fuzzer) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=holvonix-open/io-ts-fuzzer)](https://dependabot.com) [![DeepScan grade](https://deepscan.io/api/teams/4465/projects/6653/branches/56883/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=4465&pid=6653&bid=56883) [![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

`io-ts-fuzzer` lets you generate examples of a given `io-ts` type.

## Quick Start

After `yarn add io-ts io-ts-fuzzer`...

````typescript
import * as t from 'io-ts';
import * as fuzz from 'io-ts-fuzzer';

function fuzz() {
  // Fuzzers for common types
  const r = fuzz.createCoreRegistry();

  // Type to fuzz
  const target = t.union([t.string, t.type({n:t.number, b:t.boolean})]);

  // Builds a particular fuzzer from the registry.
  const fuzzer = fuzz.exampleGenerator(r, target);

  // Make examples. The input number fully determines
  // the output example.
  console.log(fuzzer.encode(0));
  console.log(fuzzer.encode(1));
  console.log(fuzzer.encode(2));
  console.log(fuzzer.encode(493));
}
````

## Types Supported

Currently supports (and their nested closure):

* `t.number`
* `t.string`
* `t.boolean`
* `t.union`
* `t.type` (interface)
* `t.partial`
* `t.intersection`
* `t.array`
* `t.null`
* `t.undefined`
* `t.void`
* `t.unknown`
* `t.Int`
* `t.literal`
* `t.keyof`
* `t.tuple`
* `t.exact`

## Use Cases

### Generating Conforming Examples and Verifying Decoder Behavior

Given a `d = t.Decoder<I,A>` (aka a `t.Type`), `fuzz.exampleGenerator` will
build a `t.Encoder<number,A>` that will give example instances of `A`.
The example instances should all pass on `d.decode`, which should return
an identical example.  No exceptions should be thrown.

### Configuring Core Fuzzers

The `FluentRegistry` interface lets you easily change certain core
fuzzers, currently:

* maximum array length
* extra properties inserted into `partial` and `type` (interface) objects

### Fuzzing a Type (TODO)


## License

Read the [LICENSE](LICENSE) for details.  
The entire [NOTICE](NOTICE) file serves as the NOTICE that must be included under
Section 4d of the License.

````

# io-ts-fuzzer

This product contains software originally developed by Holvonix LLC.
Original Repository: https://github.com/holvonix-open/io-ts-fuzzer

Copyright (c) 2019 Holvonix LLC. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Third-party dependencies may have their own licenses.

````
