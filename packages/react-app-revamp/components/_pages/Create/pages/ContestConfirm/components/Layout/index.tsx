import Image from "next/image";
import { FC, ReactNode, useState } from "react";

interface CreateConfirmLayoutProps {
  children: ReactNode;
  onHover?: (value: boolean) => void;
  onClick?: () => void;
}

const CreateContestConfirmLayout: FC<CreateConfirmLayoutProps> = ({ children, onClick, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

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
