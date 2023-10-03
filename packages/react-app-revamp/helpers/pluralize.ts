export const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
};
