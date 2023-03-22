export function isObjectEmpty(obj: any) {
  return Object.values(obj).every(value => !value);
}
