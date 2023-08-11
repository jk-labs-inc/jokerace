import { FC, ReactNode } from "react";

interface MarkdownUnorderedListProps {
  children: ReactNode & ReactNode[];
  props: any;
}

const MarkdownUnorderedList: FC<MarkdownUnorderedListProps> = ({ children, props }) => (
  <ul {...props} className="list-disc list-inside list-explainer">
    {children}
  </ul>
);

export default MarkdownUnorderedList;
