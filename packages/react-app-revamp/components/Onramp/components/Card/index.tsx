import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface OnrampCardProps {
  name: string;
  description: string;
  logo: string;
  logoBorderColor?: string;
  descriptionClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledMessage?: string;
}

const OnrampCard: FC<OnrampCardProps> = ({
  name,
  description,
  logo,
  logoBorderColor,
  onClick,
  descriptionClassName = "",
  disabled = false,
  disabledMessage = "",
}) => {
  return (
    <div className="relative">
      {disabled && disabledMessage && (
        <div className="absolute top-0 right-0 z-10 bg-negative-11 text-true-black px-2 py-1 rounded-md text-[12px] font-bold">
          {disabledMessage}
        </div>
      )}
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`group flex w-full p-4 rounded-2xl border border-transparent ${
          disabled
            ? "opacity-50 cursor-not-allowed filter blur-[1px]"
            : "cursor-pointer md:hover:border-neutral-11 transition-colors duration-300 ease-in-out"
        } shadow-entry-card`}
      >
        <div className="flex gap-4 items-center w-full">
          <img
            src={logo}
            alt={name}
            className="w-10 h-10 rounded-full border px-[3px]"
            style={logoBorderColor ? { borderColor: logoBorderColor } : {}}
          />
          <div className="flex flex-col items-start">
            <p className="text-neutral-11 font-bold text-[24px]">{name}</p>
            <p
              className={`text-neutral-9 font-bold normal-case ${descriptionClassName || "text-[12px] md:text-[16px]"}`}
            >
              {description}
            </p>
          </div>
          <div className="ml-auto">
            <ChevronRightIcon
              className={`w-6 h-6 text-neutral-9 ${
                disabled ? "" : "md:group-hover:text-neutral-11 transition-colors duration-300 ease-in-out"
              }`}
            />
          </div>
        </div>
      </button>
    </div>
  );
};

export default OnrampCard;
