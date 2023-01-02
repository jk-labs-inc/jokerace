const english_ordinal_rules = new Intl.PluralRules("en", {type: "ordinal"});
const suffixes: any = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th"
};
/**
 * 
 * @param n : number you need to add your ordinal suffix to
 * @returns a string `n` with the ordinal suffix (st, nd, th...) attached to it. Eg: `1st`
 */
export function ordinalize(n: number): string {
    const category = english_ordinal_rules.select(n);
    const suffix = suffixes[category];
    return `${n}${suffix}`;
}
export default ordinalize