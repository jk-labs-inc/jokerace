import { FC, ReactNode } from "react";

interface MarkdownTextProps {
  children: ReactNode & ReactNode[];
  props: any;
}

const MarkdownText: FC<MarkdownTextProps> = ({ children, props }) => (
  <p {...props} className="m-0 text-[16px] md:text-[20px]">
    {children}
  </p>
);

export default MarkdownText;
