interface SectionTitleProps {
  children: string;
  size?: "sm" | "lg";
  id?: string;
}

const SectionTitle = ({ children, size = "sm", id }: SectionTitleProps) => {
  const sizeClasses = size === "lg" ? "text-[20px] md:text-[24px]" : "text-[16px] md:text-[20px]";

  return (
    <p className={`text-neutral-11 ${sizeClasses} font-bold normal-case`} id={id}>
      {children}
    </p>
  );
};

export default SectionTitle;
