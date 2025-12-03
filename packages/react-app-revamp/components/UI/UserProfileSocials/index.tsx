import { FC } from "react";

export interface SocialLinks {
  etherscan?: string;
  cluster?: string;
}

export interface UserProfileSocialsProps {
  socials: SocialLinks;
  className?: string;
  iconSize?: "small" | "medium" | "large";
}

const ICON_SIZES = {
  small: "w-4 h-4",
  medium: "w-6 h-6",
  large: "w-8 h-8",
};

export const UserProfileSocials: FC<UserProfileSocialsProps> = ({ socials, className = "", iconSize = "medium" }) => {
  const sizeClass = ICON_SIZES[iconSize];

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {socials?.etherscan ? (
        <a href={socials.etherscan} target="_blank" rel="noopener noreferrer">
          <div className={`${sizeClass} flex justify-center items-center overflow-hidden rounded-full`}>
            <img className="object-cover" src="/etherscan.svg" alt="Etherscan" />
          </div>
        </a>
      ) : null}

      {socials?.cluster ? (
        <a href={socials.cluster} target="_blank" rel="noopener noreferrer">
          <div className={`${sizeClass} flex justify-center items-center overflow-hidden rounded-full`}>
            <img className="object-cover" src="/socials/cluster.png" alt="Cluster" />
          </div>
        </a>
      ) : null}
    </div>
  );
};

export default UserProfileSocials;
