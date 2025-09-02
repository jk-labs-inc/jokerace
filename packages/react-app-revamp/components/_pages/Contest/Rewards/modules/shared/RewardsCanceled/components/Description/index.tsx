import { FC } from "react";

interface RewardsCanceledDescriptionProps {
  isCanceledByJkLabs: boolean;
  isCreatorView: boolean;
}

const RewardsCanceledDescription: FC<RewardsCanceledDescriptionProps> = ({ isCanceledByJkLabs, isCreatorView }) => {
  if (isCanceledByJkLabs) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[16px] text-neutral-11">
          <b>this rewards module has been canceled by jk labs at least a week after the underlying contest has ended and only they can withdraw the remaining funds in it to resolve any issues.</b>
        </p>
      </div>
    )
  } else {
    switch (isCreatorView) {
      case true:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11">
              <b>you have canceled rewards for this contest.</b> <br />
              only you can withdraw the funds that were put into this module.
            </p>
          </div>
        );
      case false:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11 font-bold">
              the contest creator canceled rewards for this contest.
            </p>
          </div>
        );
    }
  }
};

export default RewardsCanceledDescription;
