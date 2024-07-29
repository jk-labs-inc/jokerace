/* eslint-disable @next/next/no-img-element */
import { ROUTE_VIEW_USER } from "@config/routes";
import useProfileData from "@hooks/useProfileData";
import Link from "next/link";
import { FC } from "react";

interface UserProfileDisplayProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  size?: "extraSmall" | "small" | "medium" | "large";
  textualVersion?: boolean;
  avatarVersion?: boolean;
  includeSocials?: boolean;
}

interface AvatarProps {
  src: string;
  size: "extraSmall" | "small" | "medium" | "large";
}

const SIZES = {
  extraSmall: {
    avatarSizeClass: "w-6 h-6",
    textSizeClass: "text-[12px]",
  },
  small: {
    avatarSizeClass: "w-8 h-8",
    textSizeClass: "text-[16px]",
  },
  medium: {
    avatarSizeClass: "w-14 h-14",
    textSizeClass: "text-[18px] font-sabo",
  },
  large: {
    avatarSizeClass: "w-[100px] h-[100px]",
    textSizeClass: "text-[24px] font-sabo",
  },
};

const Avatar: FC<AvatarProps> = ({ src, size }) => {
  const { avatarSizeClass } = SIZES[size];

  return (
    <div className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}>
      <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={src} alt="avatar" />
    </div>
  );
};

const UserProfileDisplay = ({
  textualVersion,
  avatarVersion,
  ethereumAddress,
  includeSocials,
  shortenOnFallback,
  size = "small",
}: UserProfileDisplayProps) => {
  const { profileName, profileAvatar, socials, isLoading } = useProfileData(
    ethereumAddress,
    shortenOnFallback,
    includeSocials,
  );
  const { avatarSizeClass, textSizeClass } = SIZES[size];

  if (textualVersion) {
    return (
      <Link
        className="text-[16px] font-bold"
        target="_blank"
        rel="noopener noreferrer"
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
      >
        {profileName}
      </Link>
    );
  }

  if (avatarVersion) {
    return (
      <Link
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
        className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}
      >
        <Avatar src={profileAvatar} size={size} />
      </Link>
    );
  }

  return (
    <span
      className={`flex ${
        size === "large" ? "gap-6" : size === "medium" ? "gap-4" : "gap-2"
      } items-center ${textSizeClass} text-neutral-11 font-bold`}
    >
      <div className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}>
        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={profileAvatar} alt="avatar" />
      </div>
      {isLoading ? (
        <p className={`${textSizeClass} animate-flicker-infinite`}>Loading profile data</p>
      ) : (
        <div className="animate-reveal flex flex-col gap-1">
          <a
            className={`no-underline ${textSizeClass} text-neutral-11 font-bold`}
            target="_blank"
            rel="noopener noreferrer"
            href={includeSocials ? undefined : `${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
          >
            {profileName}
          </a>

          {includeSocials ? (
            <div className="flex gap-2 items-center">
              <a href={socials?.etherscan} target="_blank">
                <div className="w-6 h-6 flex justify-center items-center overflow-hidden rounded-full">
                  <img className="object-cover" src="/etherscan.svg" alt="Etherscan" />
                </div>
              </a>

              {socials?.lens ? (
                <a href={socials.lens} target="_blank">
                  <div className="w-12 h-12 flex justify-center items-center overflow-hidden rounded-full">
                    <img className="object-cover" src="/socials/lens.svg" alt="Lens" />
                  </div>
                </a>
              ) : null}

              {socials?.cluster ? (
                <a href={socials.cluster} target="_blank">
                  <div className="w-6 h-6 flex justify-center items-center overflow-hidden rounded-full">
                    <img className="object-cover" src="/socials/cluster.png" alt="Cluster" />
                  </div>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </span>
  );
};

export default UserProfileDisplay;
