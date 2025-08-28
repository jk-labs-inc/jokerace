import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AddFundsCardProps {
  name: string;
  description: string;
  logo: string;
  logoBorderColor?: string;
  descriptionClassName?: string;
  disabled?: boolean;
  disabledMessage?: string;
  children?: ReactNode;
}

const AddFundsCard: FC<AddFundsCardProps> = ({
  name,
  description,
  logo,
  logoBorderColor,
  descriptionClassName = "",
  disabled = false,
  disabledMessage = "",
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        className={`${disabled ? "filter blur-[1px] opacity-50" : ""} ${
          isExpanded && children ? "shadow-entry-card rounded-2xl" : ""
        } ${isExpanded && children ? "border border-transparent" : ""}`}
      >
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`group flex w-full p-4 ${isExpanded ? "rounded-t-2xl" : "rounded-2xl"} border border-transparent ${
            !isExpanded && !disabled ? "hover:border-neutral-9" : ""
          } transition-colors duration-300 ease-in-out ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${
            !isExpanded || !children ? "shadow-entry-card" : ""
          }`}
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
              {!disabled &&
                (isExpanded ? (
                  <ChevronUpIcon className="w-6 h-6 text-neutral-9 transition-colors duration-300 ease-in-out" />
                ) : (
                  <ChevronDownIcon
                    className={`w-6 h-6 text-neutral-9 transition-colors duration-300 ease-in-out ${
                      !disabled ? "group-hover:text-neutral-11" : ""
                    }`}
                  />
                ))}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-l border-r border-b border-transparent rounded-b-2xl"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
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
