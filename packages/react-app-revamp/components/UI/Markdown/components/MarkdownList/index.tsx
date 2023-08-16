import { FC, ReactNode } from "react";

interface MarkdownListProps {
  children: ReactNode & ReactNode[];
  props: any;
}

const MarkdownList: FC<MarkdownListProps> = ({ children, props }) => <li {...props}>{children}</li>;

export default MarkdownList;
