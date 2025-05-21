import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { FC, ReactNode } from "react";

interface RankingSuffixProps {
  ranking: number;
  text: string;
  prefix?: ReactNode;
}

const RankingSuffix: FC<RankingSuffixProps> = ({ ranking, text, prefix }) => (
  <>
    {prefix && <>{prefix} </>}
    {ranking}
    <sup>{returnOnlySuffix(ranking)}</sup> {text}
  </>
);

export default RankingSuffix;
