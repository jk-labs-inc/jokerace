import Image from "next/image";
import { FC, ReactNode, useState } from "react";

interface CreateConfirmLayoutProps {
  children: ReactNode;
  onHover?: (value: boolean) => void;
  onClick?: () => void;
}

const CreateConfirmLayout: FC<CreateConfirmLayoutProps> = ({ children, onClick, onHover }) => {
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
    <div className="relative flex items-center" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div
        className={`absolute left-[-24px] transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        } cursor-pointer`}
        onClick={() => onClick?.()}
      >
        <Image src="/create-flow/edit.svg" height={16} width={16} alt="edit" />
      </div>
      {children}
    </div>
  );
};

export default CreateConfirmLayout;
