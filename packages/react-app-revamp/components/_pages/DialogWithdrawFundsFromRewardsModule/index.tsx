import DialogModalV3 from "@components/UI/DialogModalV3";

interface DialogWithdrawFundsFromRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export const DialogWithdrawFundsFromRewardsModule = (props: DialogWithdrawFundsFromRewardsModuleProps) => {
  const { children, ...dialogProps } = props;

  return (
    <DialogModalV3 title="Withdraw rewards from module" {...dialogProps} className="w-full md:w-[700px]">
      <p className="font-bold mb-4 animate-appear">Withdraw funds from the rewards module</p>
      {children}
    </DialogModalV3>
  );
};

export default DialogWithdrawFundsFromRewardsModule;
