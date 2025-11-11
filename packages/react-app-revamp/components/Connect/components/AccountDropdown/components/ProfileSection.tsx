import { Avatar } from "@components/UI/Avatar";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { formatUnits } from "viem";
import { formatBalance } from "@helpers/formatBalance";

interface ProfileSectionProps {
  address: string;
  ensAvatar: string | null | undefined;
  ensName: string | null | undefined;
  displayName: string;
  balance:
    | {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
      }
    | undefined;
}

const ProfileSection: FC<ProfileSectionProps> = ({ address, ensAvatar, ensName, displayName, balance }) => {
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 1000);
  };

  return (
    <div className="p-4 border-b border-neutral-17">
      <div className="flex items-start gap-4">
        <Avatar src={(ensAvatar as string) || ""} size="medium" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-bold text-neutral-11">{ensName || displayName}</p>
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-2 text-[12px] text-neutral-9 hover:text-neutral-11 transition-colors text-left"
            >
              <span>
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {isAddressCopied ? (
                <CheckCircleIcon className="w-3 h-3 text-positive-11" />
              ) : (
                <img src="/icons/copy.svg" alt="copy" className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 text-[14px] font-bold text-neutral-11">
            <span className="text-neutral-9">Balance:</span>
            <span>
              {formatBalance(formatUnits(balance?.value ?? 0n, balance?.decimals ?? 18))} {balance?.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
