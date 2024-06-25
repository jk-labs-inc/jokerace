export const getEnumIndex = <T extends object>(enumObject: T, value: T[keyof T]): number => {
  const enumValues = Object.values(enumObject);
  return enumValues.indexOf(value as unknown as T[keyof T]);
};
