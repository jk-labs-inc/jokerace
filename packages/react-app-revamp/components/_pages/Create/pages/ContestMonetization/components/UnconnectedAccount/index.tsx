import { useConnectModal } from "@rainbow-me/rainbowkit";

const CreateContestChargeUnconnectedAccount = () => {
  const { openConnectModal } = useConnectModal();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] md:text-[20px] text-neutral-11">
        ruh-roh! connect your wallet to unlock monetization options. <br />
        Discover supported chains and features by{" "}
        <span
          onClick={openConnectModal}
          className="text-positive-11 font-bold cursor-pointer hover:text-positive-9 transition-colors"
        >
          connecting your wallet
        </span>{" "}
        now.
      </p>
    </div>
  );
};

export default CreateContestChargeUnconnectedAccount;
