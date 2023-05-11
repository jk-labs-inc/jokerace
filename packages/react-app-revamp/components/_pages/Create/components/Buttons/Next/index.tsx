import Button from "@components/UI/Button";
import Image from "next/image";
import { FC } from "react";

interface CreateNextButtonProps {
  step: number;
}

const CreateNextButton: FC<CreateNextButtonProps> = ({ step }) => {
  return (
    /*TODO: Check why 24px is not being applied */
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-3">
        <Button className="bg-gradient-next rounded-[10px] py-2 px-[38px] font-bold">next</Button>

        {step > 1 && (
          <div className="flex items-center gap-[2px]">
            <Image src="/create-flow/back.png" alt="back" width={20} height={18} className="mt-[1px]" />
            <p className="text-[16px]">back</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-[2px]">
        <p className="text-[16px]">
          press <span className="font-bold capitalize">enter</span>
        </p>
        <Image src="/create-flow/enter.png" alt="enter" width={14} height={14} />
      </div>
    </div>
  );
};

export default CreateNextButton;
