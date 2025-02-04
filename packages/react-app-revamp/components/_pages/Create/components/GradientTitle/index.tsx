interface CreateGradientTitleProps {
  children: React.ReactNode;
  additionalInfo?: "required" | "recommended";
}

const CreateGradientTitle = ({ children, additionalInfo }: CreateGradientTitleProps) => {
  return (
    <p className={`text-[20px] font-bold bg-gradient-title bg-clip-text text-transparent`}>
      {children}

      {additionalInfo && <span className="font-normal"> ({additionalInfo})</span>}
    </p>
  );
};

export default CreateGradientTitle;
