import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const NANCE_EXTENSION: Extension = {
  name: "nance",
  metadata: {
    title: "crowdfund your contest",
    creator: "by nance",
    description: "let your community choose whether to collectively fund rewards—and then do so.",
    buttonLabel: "crowdfund away",
  },
};

const NanceExtension = () => {
  //TODO: supply nance extension url
  const onNanceExtensionClick = () => {};

  return <ExtensionCard metadata={NANCE_EXTENSION.metadata} onClick={onNanceExtensionClick} />;
};

export default NanceExtension;
