import BurgerMenu from "@components/UI/BurgerMenu";
import GradientText from "@components/UI/GradientText";
import { FOOTER_LINKS } from "@config/links";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import CancelContest from "../CancelContest";

interface ContestNameProps {
  contestName: string;
}

const ContestName: FC<ContestNameProps> = ({ contestName }) => {
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const allowedLinks = ["Github", "Twitter", "Telegram", "Report a bug", "Terms", "Media Kit"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));

  return (
    <div className={`flex items-center justify-between ${isMobile ? "w-full" : ""}`}>
      <GradientText text={contestName} isStrikethrough={isContestCanceled} />
      {isMobile ? (
        <div className="flex flex-col items-center gap-2">
          <BurgerMenu>
            <div className="flex justify-end flex-col gap-2">
              {filteredLinks.map((link, key) => (
                <a
                  className="font-sabo text-neutral-11 text-[24px]"
                  key={`footer-link-${key}`}
                  href={link.href}
                  rel="nofollow noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </BurgerMenu>
          <CancelContest />
        </div>
      ) : (
        <CancelContest />
      )}
    </div>
  );
};

export default ContestName;
