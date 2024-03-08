import Image from "next/image";
import { FC, ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface CreateConfirmLayoutProps {
  children: ReactNode;
  onHover?: (value: boolean) => void;
  onClick?: () => void;
}

const CreateContestConfirmLayout: FC<CreateConfirmLayoutProps> = ({ children, onClick, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const onMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  if (isMobileOrTablet) {
    return (
      <div className="relative flex gap-2">
        <div className={`absolute top-[4px] cursor-pointer transition-opacity duration-300`} onClick={onClick}>
          <Image src="/create-flow/edit.svg" height={16} width={16} alt="edit" />
        </div>
        <div className="flex ml-6">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div
        className={`absolute top-[4px] left-[-24px] cursor-pointer transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClick}
      >
        <Image src="/create-flow/edit.svg" height={16} width={16} alt="edit" />
      </div>
      <div className="flex items-start">{children}</div>
    </div>
  );
};

export default CreateContestConfirmLayout;
