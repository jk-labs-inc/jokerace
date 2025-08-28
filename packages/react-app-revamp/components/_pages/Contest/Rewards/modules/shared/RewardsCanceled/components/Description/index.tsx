import { FC } from "react";

interface RewardsCanceledDescriptionProps {
  isCanceledByJkLabs: boolean;
  isCreatorView: boolean;
}

const RewardsCanceledDescription: FC<RewardsCanceledDescriptionProps> = ({ isCanceledByJkLabs, isCreatorView }) => {
  if (isCanceledByJkLabs) {
    switch (isCreatorView) {
      case true:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11">
              <b>jk labs have canceled rewards for this contest.</b> <br />
              only they have access to funds.
            </p>
            <p className="text-[16px] text-neutral-11">
              please be in touch with them in case you <br />
              need to distribute funds manually.
            </p>
          </div>
        );
      case false:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11 font-bold">jk labs canceled rewards for this contest.</p>
            <p className="text-[16px] text-neutral-11">
              only jk labs can distribute any funds <br /> from this contest. please reach out to them <br /> directly
              for any support.
            </p>
          </div>
        );
    }
  } else {
    switch (isCreatorView) {
      case true:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11">
              <b>you have canceled rewards for this contest.</b> <br />
              only you have access to funds.
            </p>
            <p className="text-[16px] text-neutral-11">
              please be in touch with players in case you <br />
              need to distribute funds to them manually.
            </p>
          </div>
        );
      case false:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11 font-bold">
              the contest creator canceled rewards for this contest.
            </p>
            <p className="text-[16px] text-neutral-11">
              only the contest creator can distribute any funds <br /> from this contest. please reach out to them{" "}
              <br /> directly for any support.
            </p>
          </div>
        );
    }
  }
};

export default RewardsCanceledDescription;
