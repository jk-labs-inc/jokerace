/* eslint-disable react/no-unescaped-entities */

import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

const CreateContestDeploying = () => {
  const { isSuccess, deployContestData } = useDeployContestStore(state => state);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      const toastId = toast.loading("redirecting you to the contest page..");
      setTimeout(() => {
        toast.dismiss(toastId);

        router.push(
          `/contest/${deployContestData.chain.toLowerCase()?.replace(" ", "")}/${deployContestData.address}?popup=true`,
        );
      }, 5000);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-4 mt-12 lg:mt-[100px] animate-swingInLeft">
      <p className="text-[24px] font-bold text-primary-10 uppercase font-sabo">
        You reached the end, congratulations! 🥳
      </p>
      <hr className="w-[60px] border-neutral-10" />
      <p className="text-[18px] text-neutral-11">while we deploy your contest, kindly wait a moment.</p>
      <p className="text-[18px] text-neutral-11">shortly you'll be redirected to the contest page!</p>
    </div>
  );
};

export default CreateContestDeploying;
