import React, { FC } from "react";

interface CreateContestTypesCardProps {
  children: React.ReactNode;
}

const CreateContestTypesCard: FC<CreateContestTypesCardProps> = ({ children }) => {
  return (
    <div className="flex flex-col gap-8 w-[337px] md:w-[464px] pt-8 px-4 pb-6 border rounded-2xl border-primary-2 hover:border-neutral-11 transition-all duration-300 cursor-pointer shadow-file-upload">
      {children}
    </div>
  );
};

export default CreateContestTypesCard;
