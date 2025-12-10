interface SectionTitleProps {
  children: string;
  size?: "sm" | "lg";
}

const SectionTitle = ({ children, size = "sm" }: SectionTitleProps) => {
  const sizeClasses = size === "lg" ? "text-[20px] md:text-[24px]" : "text-[16px] md:text-[20px]";

  return <p className={`text-neutral-11 ${sizeClasses} font-bold normal-case`}>{children}</p>;
};

export default SectionTitle;
