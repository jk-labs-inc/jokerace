import { FC, ReactNode } from "react";

interface CreateTextContainerProps {
  children: ReactNode;
  className?: string;
}

const CreateTextContainer: FC<CreateTextContainerProps> = ({ children, className = "md:w-[448px]" }) => {
  return (
    <div className={`flex flex-col gap-4 w-full rounded-4xl p-6 bg-primary-1 text-[16px] text-neutral-11 ${className}`}>
      {children}
    </div>
  );
};

export default CreateTextContainer;
