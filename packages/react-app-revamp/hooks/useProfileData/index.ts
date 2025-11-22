import { lensClient } from "@config/lens";
import { config } from "@config/wagmi";
import { getEnsAvatar, getEnsName } from "@wagmi/core";
import useFarcasterProfile from "@hooks/useFarcasterProfile";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR_URL = "/contest/user.svg";

interface ProfileData {
  profileName: string;
  profileAvatar: string;
  isLoading: boolean;
  isLens: boolean;
  isFarcaster: boolean;
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
  const farcasterProfile = useFarcasterProfile();
  const [data, setData] = useState<ProfileData>({
    profileName: shortenOnFallback
      ? `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`
      : ethereumAddress,
    profileAvatar: DEFAULT_AVATAR_URL,
    isLoading: true,
    isLens: false,
    isFarcaster: false,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      let profileName = shortenOnFallback
        ? `${ethereumAddress.substring(0, 6)}...${ethereumAddress.slice(-3)}`
        : ethereumAddress;
      let profileAvatar = DEFAULT_AVATAR_URL;
      let isLens = false;
      let isFarcaster = false;

      try {
        // Priority 1: Check if user has Farcaster profile from MiniApp context
        if (farcasterProfile) {
          profileName = farcasterProfile.username;
          profileAvatar = farcasterProfile.pfpUrl || DEFAULT_AVATAR_URL;
          isFarcaster = true;
          setData({ profileName, profileAvatar, isLoading: false, isLens, isFarcaster });
          return;
        }

        // Priority 2: Try Lens Protocol
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
          // Priority 3: Try ENS
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

      setData({ profileName, profileAvatar, isLoading: false, isLens, isFarcaster });
    };

    fetchProfileData();
  }, [ethereumAddress, shortenOnFallback, farcasterProfile]);

  return data;
};

export default useProfileData;
