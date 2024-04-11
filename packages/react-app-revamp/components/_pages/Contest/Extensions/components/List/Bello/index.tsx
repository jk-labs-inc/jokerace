import { extractPathSegments } from "@helpers/extractPath";
import { useBelloRedirectUrl } from "@hooks/useBello";
import { usePathname } from "next/navigation";
import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const BELLO_EXTENSION: Extension = {
  name: "bello",
  metadata: {
    title: "get analytics on your community",
    creator: "by bello",
    description: "learn about users’ behaviors across chains—powerful for getting sponsors and partners",
    buttonLabel: "get analytics",
  },
};

const BelloExtension = () => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const { redirectUrl, isLoading, isError } = useBelloRedirectUrl(address, chainName);

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
