import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const COINVISE_EXTENSIONS: Extension = {
  name: "coinvise",
  metadata: {
    title: "reward winners & voters with NFTs",
    creator: "by coinvise",
    description: "create a campaign to for winners and/or voters to claim NFTs as a reward",
    buttonLabel: "reward NFTs",
  },
};

const COINVISE_EXTENSION_LINK = "https://www.coinvise.co/campaign";

const CoinviseExtension = () => {
  const onCoinviseExtensionClick = () => {
    window.open(COINVISE_EXTENSION_LINK, "_blank");
  };

  return <ExtensionCard metadata={COINVISE_EXTENSIONS.metadata} onClick={onCoinviseExtensionClick} />;
};

export default CoinviseExtension;
