import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import Link from "next/link";
import InfoPanel from "../../InfoPanel";
import Image from "next/image";


const RewardsPlayerTiedStatus = () => {

  return (
   <div className="flex flex-col gap-4">
       <Image src="/rewards/rewards-tied.png" alt="rewards-losing" width={360} height={240} />
       <p className="text-[16px] text-neutral-11">
       <span className="text-secondary-11 font-bold">note: your entry was affected by a tie!</span> funds for <br/>ties (and all entries below the tie) revert to the <br/> contest creator to distribute manually.
       </p>
       <p className="text-[16px] text-neutral-11">
       please check with them to claim rewards.
       </p>
    </div>
  );
};

export default RewardsPlayerTiedStatus;
