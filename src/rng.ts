import * as rnd from 'seedrandom';

export function rng(seed: number) {
  return rnd.tychei(`${seed}`, { global: false });
}

export function rngi(seed: number) {
  return Math.abs(rng(seed).int32());
}
