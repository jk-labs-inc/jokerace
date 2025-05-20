import { compareVersions } from "compare-versions";
import { VOTER_REWARDS_VERSION } from "lib/rewards/types";

export function isVoterRewards(version: string) {
  return compareVersions(version, VOTER_REWARDS_VERSION) >= 0;
}
