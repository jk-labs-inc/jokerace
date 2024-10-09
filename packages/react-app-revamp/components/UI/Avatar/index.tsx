import { FC } from "react";
import { SIZES } from "../UserProfileDisplay";

export interface AvatarProps {
  src: string;
  size: "extraSmall" | "small" | "medium" | "large";
}

export const Avatar: FC<AvatarProps> = ({ src, size }) => {
  const { avatarSizeClass } = SIZES[size];

  return (
    <div className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}>
      <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={src} alt="avatar" />
    </div>
  );
};
