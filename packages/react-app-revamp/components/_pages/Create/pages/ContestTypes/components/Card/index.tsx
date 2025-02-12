import React, { FC } from "react";

interface CreateContestTypesCardProps {
  isSelected: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const CreateContestTypesCard: FC<CreateContestTypesCardProps> = ({ isSelected, children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-6 w-[337px] md:w-[464px] pt-8 px-4 pb-6 border rounded-2xl ${isSelected ? "border-neutral-11" : "border-primary-2"} transition-all duration-300 cursor-pointer shadow-file-upload`}
    >
      {children}
    </div>
  );
};

export default CreateContestTypesCard;
