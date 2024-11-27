import { usePathname } from "next/navigation";
import { Extension } from "../../../types";
import ExtensionCard from "../../Card";
import { extractPathSegments } from "@helpers/extractPath";

const DUNE_EXTENSIONS: Extension = {
  name: "dune",
  metadata: {
    title: "get full data analytics",
    creator: "by social graph ventures",
    description: "get a full dune dashboard analytics for your contest (may take a min or two to load)",
    buttonLabel: "see analytics",
  },
};

const DUNE_EXTENSION_LINK = "https://dune.com/socialgraphvc/jokerace-creator";
const DUNE_CONTRACT_ADDRESS_PARAM = "contract_address_t8c4a9";
const DUNE_CHAIN_NAME_PARAM = "chain_name_t9b433";

const DuneExtension = () => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");

  const onDuneExtensionClick = () => {
    const duneUrl = new URL(DUNE_EXTENSION_LINK);
    duneUrl.searchParams.set(DUNE_CONTRACT_ADDRESS_PARAM, address);
    duneUrl.searchParams.set(DUNE_CHAIN_NAME_PARAM, chainName.toLowerCase());
    window.open(duneUrl.toString(), "_blank");
  };

  return <ExtensionCard metadata={DUNE_EXTENSIONS.metadata} onClick={onDuneExtensionClick} />;
};

export default DuneExtension;
