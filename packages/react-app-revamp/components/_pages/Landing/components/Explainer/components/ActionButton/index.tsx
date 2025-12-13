import CustomLink from "@components/UI/Link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface ActionButtonProps {
  href: string;
  children: ReactNode;
  external?: boolean;
}

const ActionButton = ({ href, children, external = false }: ActionButtonProps) => {
  const className =
    "w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative transition-all duration-300 hover:opacity-90";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span className="mr-4 normal-case">{children}</span>
        <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
      </a>
    );
  }

  return (
    <CustomLink prefetch={true} href={href} className={className}>
      <span className="mr-4 normal-case">{children}</span>
      <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
    </CustomLink>
  );
};

export default ActionButton;
