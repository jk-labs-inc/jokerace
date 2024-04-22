import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const HATS_PROTOCOL_EXTENSION: Extension = {
  name: "hats-protocol",
  metadata: {
    title: "give winners roles and powers",
    creator: "by hats protocol",
    description: "enable winners to claim NFTs (hats) that give them rights and roles in your community",
    buttonLabel: "give winners a hat",
  },
};

const HATS_PROTOCOL_EXTENSION_LINK = "https://docs.hatsprotocol.xyz/hats-integrations/eligibility-modules/jokerace-eligibility";

const HatsProtocolExtension = () => {
  const onHatsProtocolExtensionClick = () => {
    window.open(HATS_PROTOCOL_EXTENSION_LINK, "_blank");
  };

  return <ExtensionCard metadata={HATS_PROTOCOL_EXTENSION.metadata} onClick={onHatsProtocolExtensionClick} />;
};

export default HatsProtocolExtension;
