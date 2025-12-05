import { ROUTE_VIEW_USER } from "@config/routes";
import { FC } from "react";
import CustomLink from "../Link";
import { SIZES, SizeType } from "../UserProfileDisplay/constants/sizes";

export interface UserProfileNameProps {
  ethereumAddress: string;
  profileName: string;
  size?: SizeType;
  textColor?: string;
  asLink?: boolean;
  showBy?: boolean;
  target?: "_blank" | "_self";
  className?: string;
}

export const UserProfileName: FC<UserProfileNameProps> = ({
  ethereumAddress,
  profileName,
  size = "small",
  textColor,
  asLink = true,
  showBy = false,
  target = "_blank",
  className = "",
}) => {
  const { textSizeClass } = SIZES[size];
  const textColorClass = textColor || "text-neutral-11";
  const displayText = showBy ? `by ${profileName}` : profileName;

  if (!asLink) {
    return <span className={`${textSizeClass} font-bold ${textColorClass} ${className}`}>{displayText}</span>;
  }

  return (
    <CustomLink
      className={`${textSizeClass} font-bold ${textColorClass} no-underline ${className}`}
      target={target}
      to={`${ROUTE_VIEW_USER.replace("$address", ethereumAddress)}`}
    >
      {displayText}
    </CustomLink>
  );
};

export default UserProfileName;
