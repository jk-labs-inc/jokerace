import { lensClient } from "@config/lens";
import { config } from "@config/wagmi";
import { getEnsAvatar, getEnsName } from "@wagmi/core";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR_URL = "/contest/mona-lisa-moustache.png";

interface ProfileData {
  profileName: string;
  profileAvatar: string;
  isLoading: boolean;
  isLens: boolean;
}

const checkImageUrl = (url: string, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const timeoutId = setTimeout(() => {
      img.onload = img.onerror = null;
      reject(new Error("Timeout waiting for image to load"));
    }, timeout);

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

const useProfileData = (ethereumAddress: string, shortenOnFallback: boolean): ProfileData => {
  const [data, setData] = useState<ProfileData>({
    profileName: shortenOnFallback
      ? `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`
      : ethereumAddress,
    profileAvatar: DEFAULT_AVATAR_URL,
    isLoading: true,
    isLens: false,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      let profileName = shortenOnFallback
        ? `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`
        : ethereumAddress;
      let profileAvatar = DEFAULT_AVATAR_URL;
      let isLens = false;

      try {
        const lensProfile = await lensClient.profile.fetchDefault({ for: ethereumAddress });
        if (lensProfile?.handle) {
          const avatarFragment = lensProfile.metadata?.picture;
          //@ts-ignore
          let lensAvatar = avatarFragment?.raw?.uri?.replace("ipfs://", "https://lens.infura-ipfs.io/ipfs/");
          if (lensAvatar) {
            try {
              await checkImageUrl(lensAvatar);
              profileAvatar = lensAvatar;
            } catch {
              profileAvatar = DEFAULT_AVATAR_URL;
            }
          }
          profileName = lensProfile.handle?.localName ? lensProfile.handle.localName + ".lens" : profileName;
          isLens = true;
        } else {
          const ensName = await getEnsName(config, { chainId: 1, address: ethereumAddress as `0x${string}` });
          if (ensName) {
            const ensAvatar = await getEnsAvatar(config, { name: ensName, chainId: 1 });
            if (ensAvatar) {
              try {
                await checkImageUrl(ensAvatar);
                profileAvatar = ensAvatar;
              } catch {
                profileAvatar = DEFAULT_AVATAR_URL;
              }
            }
            profileName = ensName || profileName;
          }
        }
      } catch (error) {
        console.error(error);
      }

      setData({ profileName, profileAvatar, isLoading: false, isLens });
    };

    fetchProfileData();
  }, [ethereumAddress, shortenOnFallback]);

  return data;
};

export default useProfileData;
