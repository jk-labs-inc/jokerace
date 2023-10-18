import { FC, ReactNode } from "react";

interface MarkdownUnorderedListProps {
  children: ReactNode & ReactNode[];
}

const MarkdownUnorderedList: FC<MarkdownUnorderedListProps> = ({ children }) => <ul>{children}</ul>;

export default MarkdownUnorderedList;
