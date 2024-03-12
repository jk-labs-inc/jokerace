import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmTitleProps {
  title: string;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmTitle: FC<CreateContestConfirmTitleProps> = ({ step, title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <p
        className={`text-[20px] leading-normal	normal-case font-bold ${
          isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"
        } transition-color duration-300`}
      >
        {title}
      </p>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmTitle;
