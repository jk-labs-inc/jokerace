import Button from "@components/UI/Button";
import CreateRewardsPoolSubmitButton from "./components/Buttons/Submit";
import CreateRewardsPoolRecipients from "./components/Recipients";

const CreateRewardsPool = () => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <p className="text-[24px] font-bold text-primary-10">now let’s add rewards 👉👈🤑</p>
        <div className="pl-2">
          <p className="text-[16px]">
            a rewards pool incentivizes players, compensates winners, and is <br /> open for{" "}
            <span className="italic">anyone</span> to fund.
          </p>
          <p className="text-[16px]">
            it’s up to you whether you want to add one—but it’s easier to attract <br /> and retain a community if you
            do.{" "}
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
        <CreateRewardsPoolSubmitButton />
      </div>
    </div>
  );
};

export default CreateRewardsPool;
