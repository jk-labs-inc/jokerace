interface CreateGradientTitleProps {
  children: React.ReactNode;
  additionalInfo?: "required" | "recommended" | "optional";
  textSize?: "small" | "medium";
}

const CreateGradientTitle = ({ children, additionalInfo, textSize = "medium" }: CreateGradientTitleProps) => {
  const textSizeClass = textSize === "small" ? "text-[16px]" : "text-[20px]";

  return (
    <p className={`font-bold bg-gradient-title bg-clip-text text-transparent ${textSizeClass} `}>
      {children}

      {additionalInfo && (
        <span className={`font-normal ${textSize === "small" ? "text-[14px]" : "text-[16px]"}`}>
          {" "}
          ({additionalInfo})
        </span>
      )}
    </p>
  );
};

export default CreateGradientTitle;
