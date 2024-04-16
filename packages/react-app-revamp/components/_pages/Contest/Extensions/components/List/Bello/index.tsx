import { extractPathSegments } from "@helpers/extractPath";
import { useBelloRedirectUrl } from "@hooks/useBello";
import { useContestStore } from "@hooks/useContest/store";
import { compareVersions } from "compare-versions";
import { usePathname } from "next/navigation";
import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const BELLO_EXTENSION: Extension = {
  name: "bello",
  metadata: {
    title: "get analytics on your community",
    creator: "by bello",
    description: "learn about users’ behaviors across chains—powerful for getting sponsors and partners",
    buttonLabel: "get insights",
  },
};

const BELLO_SUPPORTED_CHAINS = [
  "optimism",
  "arbitrumone",
  "berachaintestnet",
  "polygontestnet",
  "polygon",
  "base",
  "ethereum",
  "sepolia",
  "mantle",
  "mode",
  "arthera",
  "taikotestnet",
];

const JOKERACE_MIN_VERSION = "3.16";

const BelloExtension = () => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const version = useContestStore(state => state.version);
  const { redirectUrl, isLoading, isError } = useBelloRedirectUrl(address, chainName.toLowerCase());
  const isSupportedChain = BELLO_SUPPORTED_CHAINS.includes(chainName.toLowerCase());
  const isSupportedVersion = compareVersions(version, JOKERACE_MIN_VERSION) >= 0;

  if (!isSupportedChain || !isSupportedVersion) return null;

  const onBelloExtensionClick = () => {
    window.open(redirectUrl, "_blank");
  };

  return (
    <ExtensionCard
      metadata={BELLO_EXTENSION.metadata}
      onClick={onBelloExtensionClick}
      disabled={isLoading || isError}
    />
  );
};

export default BelloExtension;
