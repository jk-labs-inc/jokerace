import { Extension } from "../../../types";
import ExtensionCard from "../../Card";

const STACK_EXTENSION: Extension = {
  name: "stack",
  metadata: {
    title: "issue points for playing in contests",
    creator: "by stack",
    description: "build loyalty and engagement by letting players earn points whether or not they win contests",
    buttonLabel: "issue points",
  },
};

const STACK_EXTENSION_LINK = "https://www.stack.so/point-systems/1893/integrations/jokerace";

const StackExtension = () => {
  const onStackExtensionClick = () => {
    window.open(STACK_EXTENSION_LINK, "_blank");
  };

  return <ExtensionCard metadata={STACK_EXTENSION.metadata} onClick={onStackExtensionClick} />;
};

export default StackExtension;
