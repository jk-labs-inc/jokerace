import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface AddFundsCardProps {
  name: string;
  description: string;
  logo: string;
  logoBorderColor?: string;
  descriptionClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledMessage?: string;
}

const AddFundsCard: FC<AddFundsCardProps> = ({
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
      <div className={`${disabled ? "filter blur-[1px] opacity-50" : ""}`}>
        <button
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          className={`group flex w-full p-4 rounded-2xl border border-transparent ${
            disabled
              ? "cursor-not-allowed"
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
              <p className={`text-neutral-9 font-bold normal-case ${descriptionClassName || "text-[12px]"}`}>
                {description}
              </p>
            </div>
            <div className="ml-auto">
              {!disabled && (
                <ChevronRightIcon className="w-6 h-6 text-neutral-9 md:group-hover:text-neutral-11 transition-colors duration-300 ease-in-out" />
              )}
            </div>
          </div>
        </button>
      </div>

      {disabled && disabledMessage && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex items-start h-full px-4 pt-4">
            <div className="w-10 shrink-0"></div>
            <div className="ml-4">
              <div className="h-[36px]"></div>
              <div className="py-1 px-2 bg-neutral-3 rounded-lg inline-block">
                <p className="text-negative-11 font-bold text-[12px]">{disabledMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFundsCard;
