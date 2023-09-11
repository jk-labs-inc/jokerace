import MultiStepToast, { ToastMessage } from "@components/UI/MultiStepToast";
import { useDeployRewardsPool } from "@hooks/useDeployRewards";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useRef } from "react";
import { toast } from "react-toastify";
import CreateRewardsPoolSubmitButton from "./components/Buttons/Submit";
import CreateRewardsPoolRecipients from "./components/Recipients";

const CreateRewardsPool = () => {
  const { setCancel } = useDeployRewardsStore(state => state);
  const toastIdRef = useRef<string | number | null>(null);

  const { deployRewardsPool } = useDeployRewardsPool();
  const onSubmitRewardsPool = () => {
    const promises = deployRewardsPool();

    const statusMessages: ToastMessage[] = [
      {
        message: "1/2 creating pool...",
        successMessage: "1/2 pool created!",
        status: "pending",
      },
      {
        message: "2/2 connecting pool to contest...",
        successMessage: "2/2 pool connected!",
        status: "pending",
      },
    ];

    toastIdRef.current = toast(
      <MultiStepToast
        messages={statusMessages}
        promises={promises}
        toastIdRef={toastIdRef}
        completionMessage="your pool has been deployed!"
      />,
      {
        position: "bottom-center",
        bodyClassName: "text-[16px] font-bold",
        autoClose: false,
        icon: false,
      },
    );
  };

  const onCancelCreateRewardsPool = () => {
    setCancel(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-[24px] font-bold text-primary-10">now let’s add rewards </p>
          <p className="-mt-[5px]">👉👈🤑</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[16px]">
            a rewards pool incentivizes players, compensates winners, and helps showcase you to players.
          </p>
          <p className="text-[16px]">
            it’s up to you whether you want to add one—but it’s easier to attract
            <br /> and retain a community if you do.
          </p>
        </div>
      </div>
      <div className="mt-12">
        <p className="text-[24px] font-bold text-primary-10">how should we distribute the rewards pool?</p>
      </div>
      <div className="mt-8">
        <CreateRewardsPoolRecipients />
      </div>

      <div className="mt-6">
        <CreateRewardsPoolSubmitButton onClick={onSubmitRewardsPool} onCancel={onCancelCreateRewardsPool} />
      </div>
      <div className="mt-24 text-neutral-11 text-[12px]">
        note: you’ll have the option to withdraw all funds from the pool.{" "}
        <b>
          in case of ties, funds <br />
          will be reverted to you to distribute manually.
        </b>{" "}
        please be aware of any obligations you might
        <br /> face for receiving funds.
      </div>
    </div>
  );
};

export default CreateRewardsPool;
