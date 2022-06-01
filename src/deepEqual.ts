

export function deepEqual(a, b): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}