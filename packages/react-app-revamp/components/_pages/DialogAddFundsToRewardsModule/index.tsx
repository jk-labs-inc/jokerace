import React from "react";
import DialogModalV3 from "@components/UI/DialogModalV3";

interface DialogAddFundsToRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export const DialogAddFundsToRewardsModule = (props: DialogAddFundsToRewardsModuleProps) => {
  const { children, ...dialogProps } = props;

  return (
    <DialogModalV3 title="add rewards to module" {...dialogProps} className="w-full md:w-[1000px]">
      {children}
    </DialogModalV3>
  );
};

export default DialogAddFundsToRewardsModule;
