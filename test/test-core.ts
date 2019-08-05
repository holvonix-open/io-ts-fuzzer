import * as assert from 'assert';
import * as lib from '../src/core/core';

describe('core', () => {
  it('fuzzUnknown', () => {
    // tslint:disable-next-line:deprecation
    assert.deepStrictEqual(lib.fuzzUnknown(0), 0);
    // tslint:disable-next-line:deprecation
    assert.deepStrictEqual(lib.fuzzUnknown(14), 14);
  });
});
