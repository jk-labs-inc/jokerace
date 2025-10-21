/* eslint-disable @next/next/no-img-element */
import { ROUTE_VIEW_USER } from "@config/routes";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useProfileData from "@hooks/useProfileData";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Avatar } from "../Avatar";
import SendFundsButton from "./components/SendFundsButton";
import { erc20ChainDropdownOptions } from "@helpers/tokens";
import { SIZES } from "./constants/sizes";
import { UserProfileName } from "../UserProfileName";
import { UserProfileSocials } from "../UserProfileSocials";

interface UserProfileDisplayProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  textColor?: string;
  size?: "extraSmall" | "compact" | "small" | "medium" | "large";
  textualVersion?: boolean;
  avatarVersion?: boolean;
  includeSocials?: boolean;
  includeSendFunds?: boolean;
  onSendFundsClick?: () => void;
}

export { SIZES };

const UserProfileDisplay = ({
  textualVersion,
  avatarVersion,
  ethereumAddress,
  includeSocials,
  textColor,
  shortenOnFallback,
  size = "small",
  includeSendFunds,
  onSendFundsClick,
}: UserProfileDisplayProps) => {
  const { chain, isConnected, address: userConnectedAddress } = useAccount();
  const { profileName, profileAvatar, socials, isLoading } = useProfileData(
    ethereumAddress,
    shortenOnFallback,
    includeSocials,
  );
  const { avatarSizeClass, textSizeClass } = SIZES[size];
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const isChainSupportedForSendFunds = useMemo(() => {
    return erc20ChainDropdownOptions.some(option => option.value.toLowerCase() === chain?.name.toLowerCase());
  }, [chain]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ethereumAddress);
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 1000);
  };

  if (textualVersion) {
    return (
      <UserProfileName
        ethereumAddress={ethereumAddress}
        profileName={profileName}
        size={size}
        textColor={textColor}
        showBy={true}
        target="_blank"
      />
    );
  }

  if (avatarVersion) {
    return (
      <Avatar
        src={profileAvatar}
        size={size}
        asLink={true}
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
      />
    );
  }

  return (
    <div
      className={`flex ${size === "large" ? "gap-6" : size === "medium" ? "gap-4" : "gap-2"} items-center ${
        textColor || "text-neutral-11"
      } font-bold`}
    >
      <Avatar src={profileAvatar} size={size} />

      {isLoading ? (
        <p className={`${textSizeClass} animate-flicker-infinite`}>Loading profile data</p>
      ) : (
        <div className="animate-fade-in flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserProfileName
              ethereumAddress={ethereumAddress}
              profileName={profileName}
              size={size}
              textColor={textColor}
              asLink={!includeSocials}
              target="_blank"
            />

            {isAddressCopied ? (
              <CheckCircleIcon className="w-4 h-4 text-positive-11" />
            ) : (
              <button className="flex lg:hidden items-center gap-1" onClick={copyToClipboard}>
                <img src="/icons/copy.svg" alt="link" className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {includeSocials && socials ? <UserProfileSocials socials={socials} /> : null}

            {includeSendFunds &&
            isConnected &&
            isChainSupportedForSendFunds &&
            userConnectedAddress === ethereumAddress ? (
              <SendFundsButton onSendFundsClick={onSendFundsClick} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDisplay;
