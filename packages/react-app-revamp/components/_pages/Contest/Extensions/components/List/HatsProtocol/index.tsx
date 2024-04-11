import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const HATS_PROTOCOL_EXTENSION: Extension = {
  name: "hats-protocol",
  metadata: {
    title: "give winners role-based NFTs",
    creator: "by hats protocol",
    description: "enable winners to earn role-based NFTs that give them rights and roles in your community",
    buttonLabel: "give winners NFTs",
  },
};

const HATS_PROTOCOL_EXTENSION_LINK = "https://github.com/Hats-Protocol/jokerace-eligibility";

const HatsProtocolExtension = () => {
  const onHatsProtocolExtensionClick = () => {
    window.open(HATS_PROTOCOL_EXTENSION_LINK, "_blank");
  };

  return <ExtensionCard metadata={HATS_PROTOCOL_EXTENSION.metadata} onClick={onHatsProtocolExtensionClick} />;
};

export default HatsProtocolExtension;
