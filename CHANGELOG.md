## [4.1.3](https://github.com/holvonix-open/io-ts-fuzzer/compare/v4.1.2...v4.1.3) (2019-08-10)


### 📖 Documentation

* include min size badge [skip-release] ([54b04c6](https://github.com/holvonix-open/io-ts-fuzzer/commit/54b04c6))


### 🧦 Miscellaneous

* **deps-dev:** bump @holvonix-open/release-config-js ([#20](https://github.com/holvonix-open/io-ts-fuzzer/issues/20)) ([75e16cd](https://github.com/holvonix-open/io-ts-fuzzer/commit/75e16cd))

## [4.1.2](https://github.com/holvonix-open/io-ts-fuzzer/compare/v4.1.1...v4.1.2) (2019-08-10)


### 📖 Documentation

* clarify license ([62d47c5](https://github.com/holvonix-open/io-ts-fuzzer/commit/62d47c5))

## [4.1.1](https://github.com/holvonix-open/io-ts-fuzzer/compare/v4.1.0...v4.1.1) (2019-08-10)


### 🐛 Bug Fixes

* need seedrandom types as prod dep ([27c1860](https://github.com/holvonix-open/io-ts-fuzzer/commit/27c1860))


### 🔬 Tests

* remove spurious debugging timeout ([8338f6e](https://github.com/holvonix-open/io-ts-fuzzer/commit/8338f6e))

# [4.1.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v4.0.1...v4.1.0) (2019-08-10)


### 🌟🚀 Features

* experimental fuzzer for nonempty arrays ([#19](https://github.com/holvonix-open/io-ts-fuzzer/issues/19)) ([7e01e15](https://github.com/holvonix-open/io-ts-fuzzer/commit/7e01e15))
* export rng ([af1910f](https://github.com/holvonix-open/io-ts-fuzzer/commit/af1910f))


### 🐛 Bug Fixes

* randomize NonEmptyArray elements independently ([818a366](https://github.com/holvonix-open/io-ts-fuzzer/commit/818a366))

## [4.0.1](https://github.com/holvonix-open/io-ts-fuzzer/compare/v4.0.0...v4.0.1) (2019-08-10)


### 💄 Polish

* prettify docs ([8018a80](https://github.com/holvonix-open/io-ts-fuzzer/commit/8018a80))


### 📖 Documentation

* document use of [@experimental](https://github.com/experimental) ([3a925cc](https://github.com/holvonix-open/io-ts-fuzzer/commit/3a925cc))

# [4.0.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v3.0.5...v4.0.0) (2019-08-09)


### 🌟🚀 Features

* support io-ts-types ([#18](https://github.com/holvonix-open/io-ts-fuzzer/issues/18)) ([5489f03](https://github.com/holvonix-open/io-ts-fuzzer/commit/5489f03))


### 📖 Documentation

* fix README link typo ([4b9b5a2](https://github.com/holvonix-open/io-ts-fuzzer/commit/4b9b5a2))


### 🧦 Miscellaneous

* **deps:** bump seedrandom from 3.0.1 to 3.0.3 ([#16](https://github.com/holvonix-open/io-ts-fuzzer/issues/16)) ([91e2346](https://github.com/holvonix-open/io-ts-fuzzer/commit/91e2346))
* **deps-dev:** bump @types/chai from 4.1.7 to 4.2.0 ([#15](https://github.com/holvonix-open/io-ts-fuzzer/issues/15)) ([593a4dc](https://github.com/holvonix-open/io-ts-fuzzer/commit/593a4dc))
* **deps-dev:** bump @types/node from 12.7.0 to 12.7.1 ([9be1c28](https://github.com/holvonix-open/io-ts-fuzzer/commit/9be1c28))
* **deps-dev:** bump fp-ts from 2.0.4 to 2.0.5 ([#17](https://github.com/holvonix-open/io-ts-fuzzer/issues/17)) ([6d16718](https://github.com/holvonix-open/io-ts-fuzzer/commit/6d16718))
* **deps-dev:** bump husky from 3.0.2 to 3.0.3 ([#14](https://github.com/holvonix-open/io-ts-fuzzer/issues/14)) ([83b11a5](https://github.com/holvonix-open/io-ts-fuzzer/commit/83b11a5))
* make prod deps updates chores by default ([1d16fd1](https://github.com/holvonix-open/io-ts-fuzzer/commit/1d16fd1))


### ⚠️ BREAKING CHANGES

* Fuzzers now have an input and decoded type.  Fuzzer generate as output the *input* of the t.Type, not the decoded or output types.

## [3.0.5](https://github.com/holvonix-open/io-ts-fuzzer/compare/v3.0.4...v3.0.5) (2019-08-08)


### 🐛 Bug Fixes

* ensure non-integers can be used as input to fuzzers ([2d5cc60](https://github.com/holvonix-open/io-ts-fuzzer/commit/2d5cc60))

## [3.0.4](https://github.com/holvonix-open/io-ts-fuzzer/compare/v3.0.3...v3.0.4) (2019-08-08)


### 🐛 Bug Fixes

* string examples made slightly more interesting ([4213c0e](https://github.com/holvonix-open/io-ts-fuzzer/commit/4213c0e))

## [3.0.3](https://github.com/holvonix-open/io-ts-fuzzer/compare/v3.0.2...v3.0.3) (2019-08-07)


### 📖 Documentation

* make examples work without yarn ([ec06241](https://github.com/holvonix-open/io-ts-fuzzer/commit/ec06241))

## [3.0.2](https://github.com/holvonix-open/io-ts-fuzzer/compare/v3.0.1...v3.0.2) (2019-08-07)


### 💄 Polish

* prettify README.md ([5ca9127](https://github.com/holvonix-open/io-ts-fuzzer/commit/5ca9127))


### 📖 Documentation

* link to io-ts repo ([3eaef06](https://github.com/holvonix-open/io-ts-fuzzer/commit/3eaef06))

## [3.0.1](https://github.com/holvonix-open/io-ts-fuzzer/compare/v3.0.0...v3.0.1) (2019-08-07)


### 🐛 Bug Fixes

* move fp-ts and io-ts to peer dependencies ([6a95707](https://github.com/holvonix-open/io-ts-fuzzer/commit/6a95707))


### 💄 Polish

* run non-typescript through prettier ([d95bf76](https://github.com/holvonix-open/io-ts-fuzzer/commit/d95bf76))


### 📖 Documentation

* add runnable quick start example ([34109f9](https://github.com/holvonix-open/io-ts-fuzzer/commit/34109f9))
* fix up README typos ([518e880](https://github.com/holvonix-open/io-ts-fuzzer/commit/518e880))


### 🔧 Build / Continuous Integration

* use cd instead of pushd in build scripts ([96ad9e9](https://github.com/holvonix-open/io-ts-fuzzer/commit/96ad9e9))


### 🔬 Tests

* tests never test for uniqueness for examples ([a52f4c3](https://github.com/holvonix-open/io-ts-fuzzer/commit/a52f4c3))

# [3.0.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v2.0.0...v3.0.0) (2019-08-07)


### 🌟🚀 Features

* support `date` from io-ts-types.  This new dependency is added as a peer -- code using it is only imported on calling `loadIoTsTypesFuzzers()` ([#11](https://github.com/holvonix-open/io-ts-fuzzer/issues/11)) ([4384326](https://github.com/holvonix-open/io-ts-fuzzer/commit/4384326))


### ⚠️ BREAKING CHANGES

* `core` exports re-organized; some removed.  From here on,
only breaking changes to exports from `index.ts` will be deemed breaking
changes for the package.

# [2.0.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.10.2...v2.0.0) (2019-08-07)


### 🌟🚀 Features

* support recursive types ([#9](https://github.com/holvonix-open/io-ts-fuzzer/issues/9)) ([0c39bff](https://github.com/holvonix-open/io-ts-fuzzer/commit/0c39bff))


### ⚠️ BREAKING CHANGES

* `ExampleGenerator` now requires as input a tuple `[number,FuzzContext]`
* concrete fuzzer functions are passed as their first argument a FuzzContext specifying whether to recurse further or not
* deprecated, non-configurable versions of core fuzzers removed

## [1.10.2](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.10.1...v1.10.2) (2019-08-06)


### 🐛 Bug Fixes

* **deps:** bump io-ts from 2.0.0 to 2.0.1 ([#8](https://github.com/holvonix-open/io-ts-fuzzer/issues/8)) ([b957951](https://github.com/holvonix-open/io-ts-fuzzer/commit/b957951))

## [1.10.1](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.10.0...v1.10.1) (2019-08-05)


### 📖 Documentation

* fix readme quick start bug ([1496897](https://github.com/holvonix-open/io-ts-fuzzer/commit/1496897))

# [1.10.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.9.0...v1.10.0) (2019-08-05)


### 🌟🚀 Features

* support configuring `unknown` type fuzzing ([8d15e73](https://github.com/holvonix-open/io-ts-fuzzer/commit/8d15e73))
* support configuring extra properties for interface fuzzers ([6a9dab1](https://github.com/holvonix-open/io-ts-fuzzer/commit/6a9dab1))
* support exact types ([883ec4b](https://github.com/holvonix-open/io-ts-fuzzer/commit/883ec4b))
* support readonly types ([03fbecf](https://github.com/holvonix-open/io-ts-fuzzer/commit/03fbecf))
* support readonlyArray types ([279ab9e](https://github.com/holvonix-open/io-ts-fuzzer/commit/279ab9e))
* support UnknownArray ([0ff9aa7](https://github.com/holvonix-open/io-ts-fuzzer/commit/0ff9aa7))


### 🐛 Bug Fixes

* intersection fuzzer emits only examples consistent with each child type ([15ae0cd](https://github.com/holvonix-open/io-ts-fuzzer/commit/15ae0cd))


### 💄 Polish

* move tested codecs ([021263f](https://github.com/holvonix-open/io-ts-fuzzer/commit/021263f))

# [1.9.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.8.0...v1.9.0) (2019-08-05)


### 🌟🚀 Features

* support configuring extra properties for partial fuzzers ([5e80982](https://github.com/holvonix-open/io-ts-fuzzer/commit/5e80982))

# [1.8.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.7.0...v1.8.0) (2019-08-05)


### 🌟🚀 Features

* support tuple type ([1a433d1](https://github.com/holvonix-open/io-ts-fuzzer/commit/1a433d1))

# [1.7.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.6.0...v1.7.0) (2019-08-05)


### 🌟🚀 Features

* allow customizable max length of array fuzzing ([89a3590](https://github.com/holvonix-open/io-ts-fuzzer/commit/89a3590))


### 🐛 Bug Fixes

* use small max array length to avoid DoS ([c8ed240](https://github.com/holvonix-open/io-ts-fuzzer/commit/c8ed240))

# [1.6.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.5.0...v1.6.0) (2019-08-05)


### 🌟🚀 Features

* support keyof ([1bc1f8b](https://github.com/holvonix-open/io-ts-fuzzer/commit/1bc1f8b))


### 💄 Polish

* docs typo ([2e85b75](https://github.com/holvonix-open/io-ts-fuzzer/commit/2e85b75))


### 📖 Documentation

* make clear nested types are supported ([0d113e2](https://github.com/holvonix-open/io-ts-fuzzer/commit/0d113e2))

# [1.5.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.4.3...v1.5.0) (2019-08-05)


### 🌟🚀 Features

* support literals ([b7c6467](https://github.com/holvonix-open/io-ts-fuzzer/commit/b7c6467))

## [1.4.3](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.4.2...v1.4.3) (2019-08-05)


### 🐛 Bug Fixes

* don't run tests on end-users machines ([4432f34](https://github.com/holvonix-open/io-ts-fuzzer/commit/4432f34))

## [1.4.2](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.4.1...v1.4.2) (2019-08-04)


### 🐛 Bug Fixes

* fp-ts needs to be a dependency, peer to io-ts ([fd2ce1b](https://github.com/holvonix-open/io-ts-fuzzer/commit/fd2ce1b))

## [1.4.1](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.4.0...v1.4.1) (2019-08-04)


### 📖 Documentation

* try changelog with misc changes collapsed ([d124c50](https://github.com/holvonix-open/io-ts-fuzzer/commit/d124c50))


### 🧦 Miscellaneous

* Update CHANGELOG.md ([93c485b](https://github.com/holvonix-open/io-ts-fuzzer/commit/93c485b))

# [1.4.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.3.0...v1.4.0) (2019-08-04)


### 🌟🚀 Features

* fluent `Registry#register` function and a `Registry#exampleGenerator` implementation ([aa46fc6](https://github.com/holvonix-open/io-ts-fuzzer/commit/aa46fc6))


### 🐛 Bug Fixes

* further simply types with defaults ([8dd6364](https://github.com/holvonix-open/io-ts-fuzzer/commit/8dd6364))
* improve typesafety by eliminating use of any ([2af1539](https://github.com/holvonix-open/io-ts-fuzzer/commit/2af1539))

<details><summary>🔧 Build / Continuous Integration</summary>
<p>

* fix dep on release-config-js ([5c3aa19](https://github.com/holvonix-open/io-ts-fuzzer/commit/5c3aa19))
* use release-config-js ([294f594](https://github.com/holvonix-open/io-ts-fuzzer/commit/294f594))

</p>
</details>


<details><summary>🔬 Tests</summary>
<p>

* improve registration tests ([1124707](https://github.com/holvonix-open/io-ts-fuzzer/commit/1124707))

</p>
</details>

# [1.3.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.2.2...v1.3.0) (2019-08-03)


### Features

* support Ints ([54a29de](https://github.com/holvonix-open/io-ts-fuzzer/commit/54a29de))

## [1.2.2](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.2.1...v1.2.2) (2019-08-03)


### Performance Improvements

* remove unneeded deps ([1ba0e32](https://github.com/holvonix-open/io-ts-fuzzer/commit/1ba0e32))

## [1.2.1](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.2.0...v1.2.1) (2019-08-03)

# [1.2.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.1.0...v1.2.0) (2019-08-03)


### Features

* support arrays, intersection, null, undefined, void, unknown ([9860450](https://github.com/holvonix-open/io-ts-fuzzer/commit/9860450))


### Performance Improvements

* mark package as side-effect-free ([2ef3c69](https://github.com/holvonix-open/io-ts-fuzzer/commit/2ef3c69))

# [1.1.0](https://github.com/holvonix-open/io-ts-fuzzer/compare/v1.0.0...v1.1.0) (2019-08-03)


### Features

* support interfaces and partials ([9d7e0b0](https://github.com/holvonix-open/io-ts-fuzzer/commit/9d7e0b0))

# 1.0.0 (2019-08-03)


### Features

* basic framework + fuzz strings, numbers, bools, and unions ([d718348](https://github.com/holvonix-open/io-ts-fuzzer/commit/d718348))
