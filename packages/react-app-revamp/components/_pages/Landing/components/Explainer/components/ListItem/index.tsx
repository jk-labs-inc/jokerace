import { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
}

const ListItem = ({ children }: ListItemProps) => {
  return <li className="text-[16px] md:text-[20px] text-neutral-11 arrow-list-item">{children}</li>;
};

export default ListItem;
