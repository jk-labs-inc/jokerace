import { useFarcaster } from "@components/FarcasterProvider";
import { useEffect, useState } from "react";

interface FarcasterProfileData {
  username: string;
  displayName: string;
  pfpUrl: string;
  fid: number;
  bio?: string;
}

/**
 * Hook to get Farcaster profile data from the MiniApp SDK context
 * This uses the authenticated user context from the Farcaster MiniApp
 */
const useFarcasterProfile = (): FarcasterProfileData | null => {
  const { user, isMiniApp } = useFarcaster();
  const [profileData, setProfileData] = useState<FarcasterProfileData | null>(null);

  useEffect(() => {
    if (isMiniApp && user) {
      setProfileData({
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
        fid: user.fid,
      });
    } else {
      setProfileData(null);
    }
  }, [user, isMiniApp]);

  return profileData;
};

export default useFarcasterProfile;
