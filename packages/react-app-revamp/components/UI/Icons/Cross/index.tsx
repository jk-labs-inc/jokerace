import { FC } from "react";

interface CrossIconProps {
  color?: string;
}

const CrossIcon: FC<CrossIconProps> = ({ color = "currentColor" }) => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L7.75 8.25M13.5 14.5L7.75 8.25M7.75 8.25L13.5 2L2 14.5" stroke={color} strokeWidth="4" />
    </svg>
  );
};

export default CrossIcon;
