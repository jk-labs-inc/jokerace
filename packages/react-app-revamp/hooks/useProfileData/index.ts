import { lensClient } from "@config/lens";
import { config } from "@config/wagmi";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { getEnsAvatar, getEnsName } from "@wagmi/core";
import { normalize } from "viem/ens";

const DEFAULT_AVATAR_URL = "/contest/user.svg";

const ETHERSCAN_BASE_URL = mainnet.blockExplorers?.etherscan?.url;
const LENSFRENS_BASE_URL = "https://lensfrens.xyz";

interface ProfileData {
  profileName: string;
  profileAvatar: string;
  socials: {
    etherscan: string;
    lens: string;
  };
}

const checkImageUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      img.onload = img.onerror = null;
      reject(new Error("Timeout waiting for image to load"));
    }, 10000);
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(url);
    };
    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Image loading error"));
    };
    img.src = url;
  });
};

const fetchProfileData = async ({ queryKey }: QueryFunctionContext): Promise<ProfileData> => {
  const [ethereumAddress, shortenOnFallback, includeSocials] = queryKey as [string, boolean, boolean];
  let profileName = shortenOnFallback
    ? `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`
    : ethereumAddress;
  let profileAvatar = DEFAULT_AVATAR_URL;
  let socials = {
    etherscan: "",
    lens: "",
  };

  try {
    const ensName = await getEnsName(config, { chainId: 1, address: ethereumAddress as `0x${string}` });
    if (ensName) {
      const ensAvatar = await getEnsAvatar(config, { name: normalize(ensName), chainId: 1 });
      try {
        await checkImageUrl(ensAvatar ?? DEFAULT_AVATAR_URL);
        profileAvatar = ensAvatar ?? DEFAULT_AVATAR_URL;
        profileName = ensName;
      } catch {
        profileAvatar = DEFAULT_AVATAR_URL;
      }
    } else {
      const lensProfile = await lensClient.profile.fetchDefault({ for: ethereumAddress });
      if (lensProfile?.handle) {
        const avatarFragment = lensProfile.metadata?.picture;
        //@ts-ignore
        let lensAvatar = avatarFragment?.raw?.uri?.replace("ipfs://", "https://lens.infura-ipfs.io/ipfs/");
        try {
          await checkImageUrl(lensAvatar);
          profileAvatar = lensAvatar;
        } catch {
          profileAvatar = DEFAULT_AVATAR_URL;
        }
        profileName = lensProfile.handle?.localName ? lensProfile.handle.localName + ".lens" : profileName;
      }
    }

    if (includeSocials) {
      const lensProfile = await lensClient.profile.fetchDefault({ for: ethereumAddress });
      const handle = lensProfile?.handle?.localName;

      socials = {
        etherscan: `${ETHERSCAN_BASE_URL}/address/${ethereumAddress}`,
        lens: handle ? `${LENSFRENS_BASE_URL}/${handle}` : "",
      };
    }
  } catch (error) {
    console.error(error);
  }

  return { profileName, profileAvatar, socials };
};

const useProfileData = (ethereumAddress: string, shortenOnFallback: boolean, includeSocials?: boolean) => {
  const { data, isLoading, isError, error } = useQuery<ProfileData>({
    queryKey: [ethereumAddress, shortenOnFallback, includeSocials],
    queryFn: fetchProfileData,
    enabled: !!ethereumAddress || !!includeSocials,
  });

  return {
    profileName:
      data?.profileName ??
      (shortenOnFallback ? `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}` : ethereumAddress),
    profileAvatar: data?.profileAvatar ?? DEFAULT_AVATAR_URL,
    socials: data?.socials,
    isLoading,
    isError,
    error,
  };
};

export default useProfileData;
