import { FC, ReactNode } from "react";

interface MarkdownOrderedListProps {
  children: ReactNode & ReactNode[];
}

const MarkdownOrderedList: FC<MarkdownOrderedListProps> = ({ children }) => <ol>{children}</ol>;

export default MarkdownOrderedList;
