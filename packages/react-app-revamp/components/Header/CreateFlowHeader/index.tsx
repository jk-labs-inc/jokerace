import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const CreateFlowHeader = () => {
  const { setPageAction, pageAction } = useDeployContestStore(state => state);

  return (
    <header className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-center lg:justify-between lg:pl-[80px] lg:pr-[60px] mt-8">
      <Link href="/">
        <h1 className="font-sabo text-primary-10 text-[55px] lg:text-[40px]">JOKERACE</h1>
      </Link>

      <div className="flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 drop-shadow-2xl">
        <p
          onClick={() => setPageAction("play")}
          className={`cursor-pointer ${pageAction === "play" ? "text-primary-10" : "text-neutral-11"}`}
        >
          play
        </p>
        <p
          onClick={() => setPageAction("create")}
          className={`cursor-pointer ${pageAction === "create" ? "text-primary-10" : "text-neutral-11"}`}
        >
          create
        </p>
      </div>

      <div className="flex">
        <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
      </div>
    </header>
  );
};

export default CreateFlowHeader;
