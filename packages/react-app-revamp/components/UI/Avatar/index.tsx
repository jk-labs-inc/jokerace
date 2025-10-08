/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { SIZES, SizeType } from "../UserProfileDisplay/constants/sizes";

export interface AvatarProps {
  src: string;
  size?: SizeType;
  alt?: string;
  className?: string;
  asLink?: boolean;
  href?: string;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  size = "small",
  alt = "avatar",
  className = "",
  asLink = false,
  href,
}) => {
  const { avatarSizeClass } = SIZES[size];

  const avatarElement = (
    <div className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden ${className}`}>
      <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={src} alt={alt} />
    </div>
  );

  if (asLink && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="shrink-0">
        {avatarElement}
      </a>
    );
  }

  return avatarElement;
};
