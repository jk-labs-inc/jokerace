/* eslint-disable @next/next/no-img-element */
import { ROUTE_VIEW_USER } from "@config/routes";
import { useAvatarStore } from "@hooks/useAvatar";
import { getDefaultProfile } from "@services/lens/getDefaultProfile";
import { useQuery } from "@tanstack/react-query";
import { fetchEnsAvatar, fetchEnsName, mainnet } from "@wagmi/core";
import Link from "next/link";

const DEFAULT_AVATAR_URL = "/contest/avatar.svg";

interface EthereumAddressProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  textualVersion?: boolean;
  avatarVersion?: boolean;
  includeSocials?: boolean;
  isLarge?: boolean;
}

const EthereumAddress = ({
  textualVersion,
  avatarVersion,
  ethereumAddress,
  includeSocials,
  shortenOnFallback,
  isLarge,
}: EthereumAddressProps) => {
  const shortAddress = `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`;
  const { setAvatar } = useAvatarStore(state => state);
  const avatarSizeClass = isLarge ? "w-[100px] h-[100px]" : "w-8 h-8";
  const textSizeClass = isLarge ? "text-[24px] font-sabo" : "text-[16px]";
  const etherscan = mainnet.blockExplorers.etherscan.url;

  const fetchAvatarAndProfile = async () => {
    try {
      const lensProfile = await getDefaultProfile({ ethereumAddress });
      if (lensProfile?.data?.defaultProfile) {
        const avatarUrl =
          lensProfile.data.defaultProfile.picture?.original?.url?.replace(
            "ipfs://",
            "https://lens.infura-ipfs.io/ipfs/",
          ) || DEFAULT_AVATAR_URL;
        return { handle: lensProfile.data.defaultProfile.handle, avatarUrl };
      }
    } catch (e) {
      console.error(e);
    }

    // If no lens profile found, attempt to fetch the ens name and avatar
    try {
      const ensName = await fetchEnsName({
        chainId: 1,
        address: ethereumAddress as `0x${string}`,
      });

      if (ensName) {
        try {
          const ensAvatar = await fetchEnsAvatar({ name: ensName as string, chainId: 1 });
          return { handle: ensName, avatarUrl: ensAvatar || DEFAULT_AVATAR_URL };
        } catch (e) {
          console.error(e);
        }
        return { handle: ensName, avatarUrl: DEFAULT_AVATAR_URL };
      }
    } catch (e) {
      console.error(e);
    }

    return { handle: null, avatarUrl: DEFAULT_AVATAR_URL };
  };

  const queryProfileAndAvatar = useQuery(["profile-avatar", ethereumAddress], fetchAvatarAndProfile, {
    onSuccess: data => {
      setAvatar(ethereumAddress, data.avatarUrl);
    },
  });

  const avatarUrl = queryProfileAndAvatar.data?.avatarUrl || DEFAULT_AVATAR_URL;
  const isLoading = queryProfileAndAvatar?.status === "loading";
  const displayName = queryProfileAndAvatar?.data?.handle || (shortenOnFallback && shortAddress) || ethereumAddress;

  if (textualVersion) {
    return (
      <Link
        className="text-[16px] font-bold"
        target="_blank"
        rel="noopener noreferrer"
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
      >
        {displayName}
      </Link>
    );
  }

  if (avatarVersion) {
    return (
      <Link
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
        className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}
      >
        <img src={avatarUrl} alt="avatar" />
      </Link>
    );
  }

  return (
    <span className={`flex ${isLarge ? "gap-6" : "gap-2"} items-center ${textSizeClass} text-neutral-11 font-bold`}>
      <div className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}>
        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={avatarUrl} alt="avatar" />
      </div>
      {isLoading ? (
        <>Loading profile data...</>
      ) : (
        <div className="flex flex-col gap-1">
          <a
            className={`no-underline ${textSizeClass} text-neutral-11 font-bold`}
            target="_blank"
            rel="noopener noreferrer"
            href={includeSocials ? undefined : `${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
          >
            {displayName}
          </a>

          {includeSocials ? (
            <div className="flex gap-1 items-center">
              <a href={`${etherscan}/address/${ethereumAddress}`} target="_blank">
                <div className="w-6 h-6 flex justify-center items-center overflow-hidden rounded-full">
                  <img className="object-cover" src="/etherscan.svg" alt="Etherscan" />
                </div>
              </a>
              {queryProfileAndAvatar.data?.handle?.includes("lens") && (
                <a href={`https://lensfrens.xyz/${displayName}`} target="_blank">
                  <div className="w-12 h-12 flex justify-center items-center overflow-hidden rounded-full">
                    <img className="object-cover" src="/socials/lens.svg" alt="Lens" />
                  </div>
                </a>
              )}
            </div>
          ) : null}
        </div>
      )}
    </span>
  );
};

export default EthereumAddress;
