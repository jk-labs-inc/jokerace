import { Clusters } from "@clustersxyz/sdk";
import { config } from "@config/wagmi";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useQuery } from "@tanstack/react-query";
import { getEnsAvatar, getEnsName } from "@wagmi/core";
import { normalize } from "viem/ens";

const DEFAULT_AVATAR_URL = "/contest/user.svg";
const ETHERSCAN_BASE_URL = mainnet.blockExplorers?.etherscan?.url;

interface ProfileData {
  profileName: string;
  profileAvatar: string;
  socials: {
    etherscan: string;
    cluster: string;
  };
}

const normalizeClusterName = (clusterName: string) => {
  return clusterName.split("/")[0] + "/";
};

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

const fetchProfileData = async (
  ethereumAddress: string,
  shortenOnFallback: boolean,
  includeSocials?: boolean,
): Promise<ProfileData> => {
  let profileName = shortenOnFallback ? shortenEthereumAddress(ethereumAddress) : ethereumAddress;
  let profileAvatar = DEFAULT_AVATAR_URL;
  let socials = {
    etherscan: "",
    cluster: "",
  };
  const clusters = new Clusters();

  try {
    const ensName = await getEnsName(config, { chainId: 1, address: ethereumAddress as `0x${string}` });

    if (ensName) {
      const timeout = new Promise<string>((resolve, reject) => {
        setTimeout(() => reject(new Error("timeout: ENS avatar request took too long")), 10000);
      });

      const ensAvatarPromise = getEnsAvatar(config, {
        name: normalize(ensName),
        chainId: 1,
      });

      try {
        let ensAvatar = await Promise.race([ensAvatarPromise, timeout]);

        ensAvatar = typeof ensAvatar === "string" ? ensAvatar : DEFAULT_AVATAR_URL;

        await checkImageUrl(ensAvatar);
        profileAvatar = ensAvatar;
        profileName = ensName;
      } catch (error) {
        profileName = ensName;
        profileAvatar = DEFAULT_AVATAR_URL;
      }
    } else {
      const clusterName = await clusters.getName(ethereumAddress);
      if (clusterName) {
        try {
          const cluster = await clusters.getCluster(normalizeClusterName(clusterName));

          await checkImageUrl(cluster?.imageUrl ?? DEFAULT_AVATAR_URL);
          profileAvatar = cluster?.imageUrl ?? DEFAULT_AVATAR_URL;
          profileName = normalizeClusterName(clusterName);
        } catch {
          profileAvatar = DEFAULT_AVATAR_URL;
        }
      }
    }

    if (includeSocials) {
      const clusterName = await clusters.getName(ethereumAddress);
      let clusterProfileUrl = "";

      if (clusterName) {
        const clusterMetadata = await clusters.getCluster(normalizeClusterName(clusterName));
        clusterProfileUrl = clusterMetadata?.profileUrl ?? "";
      }

      socials = {
        etherscan: `${ETHERSCAN_BASE_URL}/address/${ethereumAddress}`,
        cluster: clusterProfileUrl,
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
    queryFn: () => fetchProfileData(ethereumAddress, shortenOnFallback, includeSocials),
    enabled: !!ethereumAddress || !!includeSocials,
    staleTime: 1000 * 60 * 60,
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
