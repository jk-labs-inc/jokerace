import { FC } from "react";
import { motion } from "motion/react";

interface CreateContestEntriesPreviewPickerOptionsContainerProps {
  title: string;
  isActive: boolean;
  imageSrc: string;
  onClick?: () => void;
}

const CreateContestEntriesPreviewPickerOptionsContainer: FC<CreateContestEntriesPreviewPickerOptionsContainerProps> = ({
  title,
  isActive,
  imageSrc,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        borderColor: isActive ? "rgb(250, 250, 250)" : "rgb(64, 64, 64)", // neutral-11 : neutral-10
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`flex flex-col w-40 h-38 md:h-[360px] md:w-96 gap-1.5 md:gap-6 p-2 md:p-6 rounded-xl md:rounded-2xl bg-true-black border ${
        isActive ? "border-neutral-11" : "border-neutral-10"
      }`}
    >
      <motion.p
        animate={{
          color: isActive ? "rgb(250, 250, 250)" : "rgb(64, 64, 64)", // neutral-11 : neutral-10
          fontWeight: isActive ? 700 : 400,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="text-base md:text-[20px] text-center"
      >
        {title}
      </motion.p>
      <div className="py-2 md:py-4 flex justify-center items-center rounded-lg border border-primary-5 overflow-hidden">
        <img src={imageSrc} alt={title} className="w-full h-full object-contain" />
      </div>
    </motion.button>
  );
};

export default CreateContestEntriesPreviewPickerOptionsContainer;
