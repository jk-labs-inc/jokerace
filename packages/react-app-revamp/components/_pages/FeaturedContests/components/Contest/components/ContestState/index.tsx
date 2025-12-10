import { FC } from "react";
import { ContestStateType } from "../../types";

interface ContestStateProps {
  state: ContestStateType;
}

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

const ContestState: FC<ContestStateProps> = ({ state }) => {
  if (!state) return null;

  if (state === "live") {
    return (
      <p className="text-xs text-positive-14 font-bold" style={textShadowStyle}>
        <span aria-hidden="true">🔥 </span>
        live
      </p>
    );
  }

  return (
    <p className="text-xs text-positive-14 font-bold" style={textShadowStyle}>
      accepting entries
    </p>
  );
};

export default ContestState;
