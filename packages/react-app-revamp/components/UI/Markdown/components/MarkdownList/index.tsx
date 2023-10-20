import { FC, ReactNode } from "react";

interface MarkdownListProps {
  children: ReactNode & ReactNode[];
}

const MarkdownList: FC<MarkdownListProps> = ({ children }) => <li>{children}</li>;

export default MarkdownList;
