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
  //TODO: supply bello extension url
  const onBelloExtensionClick = () => {};

  return <ExtensionCard metadata={BELLO_EXTENSION.metadata} onClick={onBelloExtensionClick} />;
};

export default BelloExtension;
