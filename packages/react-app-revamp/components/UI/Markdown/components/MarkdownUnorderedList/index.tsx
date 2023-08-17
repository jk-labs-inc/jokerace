import { FC, ReactNode } from "react";

interface MarkdownUnorderedListProps {
  children: ReactNode & ReactNode[];
  props: any;
}

const MarkdownUnorderedList: FC<MarkdownUnorderedListProps> = ({ children, props }) => <ul {...props}>{children}</ul>;

export default MarkdownUnorderedList;
