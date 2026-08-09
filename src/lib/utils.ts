export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
