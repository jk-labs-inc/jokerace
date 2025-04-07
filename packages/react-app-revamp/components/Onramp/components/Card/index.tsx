import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface OnrampCardProps {
  name: string;
  description: string;
  logo: string;
  logoBorderColor?: string;
  onClick?: () => void;
}

const OnrampCard: FC<OnrampCardProps> = ({ name, description, logo, logoBorderColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex p-4 rounded-2xl border border-transparent md:hover:border-neutral-11 transition-colors duration-300 ease-in-out shadow-entry-card cursor-pointer"
    >
      <div className="flex gap-4 items-center w-full">
        <img
          src={logo}
          alt={name}
          className="w-10 h-10 rounded-full border px-[3px]"
          style={logoBorderColor ? { borderColor: logoBorderColor } : {}}
        />
        <div className="flex flex-col gap-2 items-start">
          <p className="text-neutral-11 font-bold text-[24px]">{name}</p>
          <p className="text-neutral-9 font-bold text-[12px] md:text-[16px] normal-case">{description}</p>
        </div>
        <div className="ml-auto">
          <ChevronRightIcon className="w-6 h-6 text-neutral-9 md:group-hover:text-neutral-11 transition-colors duration-300 ease-in-out" />
        </div>
      </div>
    </button>
  );
};

export default OnrampCard;
