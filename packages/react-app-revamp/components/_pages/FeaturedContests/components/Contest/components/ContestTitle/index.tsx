import { FC } from "react";

export enum ContestTitleState {
  ACTIVE = "active",
  FINISHED = "finished",
  CANCELED = "canceled",
}

interface ContestTitleProps {
  title: string;
  state: ContestTitleState;
}

const ContestTitle: FC<ContestTitleProps> = ({ title, state }) => {
  return (
    <p
      className={`${
        state === ContestTitleState.ACTIVE ? "text-neutral-11" : "text-neutral-10"
      } font-bold text-2xl normal-case`}
      style={{ WebkitTextStroke: "1px black" }}
    >
      {title}
    </p>
  );
};

export default ContestTitle;
