import equal from "fast-deep-equal";


export function deepEqual(a, b): boolean {
  return equal(a, b);
}