import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const ContestDeployRewardsUnderConstruction = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div className="flex flex-col gap-48">
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative flex flex-col bg-gradient-under-construction h-[208px] md:h-[372px] rounded-2xl">
          <h1 className="pl-10 pt-6 pr-4 font-sabo-filled text-[40px] md:text-[56px] text-center md:text-left [text-shadow:4px_4px_4px_rgba(0,0,0,1)]">
            Under Construction
          </h1>
          <Image
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3 md:translate-y-1/3"
            src="/contest/bubbles-under-construction.png"
            alt="Under Construction"
            width={isMobile ? 208 : 312}
            height={isMobile ? 208 : 312}
          />
        </div>
      </div>
      <div className="bg-primary-1 flex flex-col gap-4 p-4 md:p-6 rounded-4xl">
        <p className="text-base md:text-2xl text-neutral-11 font-bold">this contest has not finished deploying :(</p>
        <p className="text-base md:text-2xl text-neutral-11">
          please reach out to the contest creator to complete the transactions for {isMobile ? "" : <br />}
          this contest to go live.
        </p>
      </div>
    </div>
  );
};

export default ContestDeployRewardsUnderConstruction;
