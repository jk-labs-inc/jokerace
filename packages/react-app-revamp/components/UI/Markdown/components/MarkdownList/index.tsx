import { FC, ReactNode } from "react";

interface MarkdownListProps {
  children: ReactNode & ReactNode[];
  props: any;
}

const MarkdownList: FC<MarkdownListProps> = ({ children, props }) => (
  <li {...props} className="flex items-center">
    {children}
  </li>
);

export default MarkdownList;
