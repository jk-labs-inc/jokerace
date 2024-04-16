import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const NANCE_EXTENSION: Extension = {
  name: "nance",
  metadata: {
    title: "crowdfund your contest",
    creator: "by nance",
    description: "let your community decide whether to crowdfund rewards for the contest",
    buttonLabel: "crowdfund away",
  },
};

const NANCE_EXTENSION_LINK = "https://nance.app/";

const NanceExtension = () => {
  const onNanceExtensionClick = () => {
    window.open(NANCE_EXTENSION_LINK, "_blank");
  };

  return <ExtensionCard metadata={NANCE_EXTENSION.metadata} onClick={onNanceExtensionClick} />;
};

export default NanceExtension;
