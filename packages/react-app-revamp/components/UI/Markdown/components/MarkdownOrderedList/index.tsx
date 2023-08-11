import { FC, ReactNode } from "react";

interface MarkdownOrderedListProps {
  children: ReactNode & ReactNode[];
  props: any;
}

const MarkdownOrderedList: FC<MarkdownOrderedListProps> = ({ children, props }) => <ol {...props}>{children}</ol>;

export default MarkdownOrderedList;
