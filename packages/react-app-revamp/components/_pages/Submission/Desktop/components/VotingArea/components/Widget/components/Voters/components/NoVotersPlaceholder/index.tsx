import Image from "next/image";
import { FC } from "react";

const NoVotersPlaceholder: FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-[16px] text-neutral-11 font-bold">well this is embarrassing.</p>
          <p className="text-[16px] text-neutral-11">
            this entry doesn't have any <br />
            votes. yet.
          </p>
          <p className="text-[16px] text-neutral-11">but you can add some above...</p>
        </div>
        <Image src="/entry/no-votes-bubbles.png" alt="no votes" width={144} height={144} />
      </div>
    </div>
  );
};

export default NoVotersPlaceholder;
