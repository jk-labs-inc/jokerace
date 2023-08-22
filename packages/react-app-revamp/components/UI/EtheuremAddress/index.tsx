/* eslint-disable @next/next/no-img-element */
import { chains } from "@config/wagmi";
import { useAvatarStore } from "@hooks/useAvatar";
import { getDefaultProfile } from "@services/lens/getDefaultProfile";
import { useQuery } from "@tanstack/react-query";
import { fetchEnsAvatar, fetchEnsName } from "@wagmi/core";
import { useRouter } from "next/router";

const DEFAULT_AVATAR_URL = "/contest/avatar.svg";

interface EthereumAddressProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  textualVersion?: boolean;
  isLarge?: boolean;
}

const EthereumAddress = ({ textualVersion, ethereumAddress, shortenOnFallback, isLarge }: EthereumAddressProps) => {
  const shortAddress = `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`;
  const { asPath } = useRouter();
  const chainName = asPath.split("/")[2];
  const { setAvatar } = useAvatarStore(state => state);
  const avatarSizeClass = isLarge ? "w-[100px] h-[100px]" : "w-8 h-8";
  const textSizeClass = isLarge ? "text-[24px] font-sabo" : "text-[16px]";

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

  const getExplorer = () => {
    const chainExplorer = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)[0]
      .blockExplorers?.default.url;

    return `${chainExplorer}address/${ethereumAddress}`;
  };

  if (textualVersion) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={
          queryProfileAndAvatar.data?.handle?.includes("lens") ? `https://lensfrens.xyz/${displayName}` : getExplorer()
        }
      >
        {displayName}
      </a>
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
        <a
          className={`no-underline cursor-pointer ${textSizeClass} text-neutral-11 font-bold`}
          target="_blank"
          rel="noopener noreferrer"
          href={
            queryProfileAndAvatar.data?.handle?.includes("lens")
              ? `https://lensfrens.xyz/${displayName}`
              : getExplorer()
          }
        >
          {displayName}
        </a>
      )}
    </span>
  );
};

export default EthereumAddress;
