import ButtonV3 from "@components/UI/ButtonV3";
import Image from "next/image";
import { useState } from "react";

const CreateRewardsPoolSubmitButton = () => {
  const [shake, setShake] = useState(false);

  //   useEffect(() => {
  //     // If there's an error for the current step, shake the button
  //     if (errors.find(error => error.step === step - 1)) {
  //       setShake(true);
  //     } else {
  //       setShake(false);
  //     }
  //   }, [errors, step]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If there's an error, shake the button
    // if (errors.find(error => error.step === step - 1)) {
    //   setShake(true);
    // }
    // if (onClick) {
    //   onClick(e);
    // }
  };

  return (
    <div className="flex gap-4 items-start pb-5 md:pb-0">
      <div className={`flex flex-col items-center gap-2`}>
        <ButtonV3 color="bg-primary-10" size="large">
          create pool!
        </ButtonV3>

        <div className="hidden lg:flex items-center gap-[2px] md:-ml-[15px] cursor-pointer group">
          <p className="text-[16px]">cancel</p>
        </div>
      </div>
      <div className="hidden lg:flex lg:items-center mt-[15px] gap-[5px]">
        <p className="text-[16px]">
          press <span className="font-bold capitalize">enter</span>
        </p>
        <Image src="/create-flow/enter.svg" alt="enter" width={14} height={14} />
      </div>
    </div>
  );
};

export default CreateRewardsPoolSubmitButton;
