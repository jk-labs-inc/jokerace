import { FC } from "react";

interface CheckmarkIconProps {
  color?: string;
}

const CheckmarkIcon: FC<CheckmarkIconProps> = ({ color = "currentColor" }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6L5.80769 10L11 1" stroke={color} strokeWidth="4" />
    </svg>
  );
};

export default CheckmarkIcon;
