import { FC } from "react";
import { ContestTitleStateType } from "../../types";

interface ContestTitleProps {
  title: string;
  state: ContestTitleStateType;
}

//TODO: make this reusable
const textShadowStyle = {
  textShadow: `
    1px 1px 0 black,
    -1px -1px 0 black,
    1px -1px 0 black,
    -1px 1px 0 black,
    0 1px 0 black,
    1px 0 0 black,
    0 -1px 0 black,
    -1px 0 0 black
  `,
};

const ContestTitle: FC<ContestTitleProps> = ({ title, state }) => {
  const isActive = state === "active";

  return (
    <p
      className={`${isActive ? "text-neutral-11" : "text-neutral-10"} font-bold text-2xl normal-case`}
      style={textShadowStyle}
    >
      {title}
    </p>
  );
};

export default ContestTitle;
