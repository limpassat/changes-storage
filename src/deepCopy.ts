

export function deepCopy<T>(val: T): T {
  if (typeof val !== "object") {
    return val;
  }
  return JSON.parse(JSON.stringify(val));
}