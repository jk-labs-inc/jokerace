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
 * @returns a string `n` with the ordinal suffix (st, nd, th...) attached to it, and the suffix
 */
export function ordinalize(n: number): {label: string, suffix: string} {
    const category = english_ordinal_rules.select(n);
    const suffix = suffixes[category];
    return {
        label: `${n}${suffix}`,
        suffix
    };
}

export default ordinalize