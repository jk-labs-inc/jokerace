import { ExtensionSupabase } from "lib/extensions";
import { FC } from "react";
import BelloExtension from "./Bello";
import CoinviseExtension from "./Coinvise";
import HatsProtocolExtension from "./HatsProtocol";
import NanceExtension from "./Nance";

type ExtensionComponentMap = {
  [key: string]: React.ComponentType<any>;
};

const EXTENSION_COMPONENTS: ExtensionComponentMap = {
  "hats-protocol": HatsProtocolExtension,
  bello: BelloExtension,
  nance: NanceExtension,
  coinvise: CoinviseExtension,
};

interface ExtensionsListProps {
  enabledExtensions: ExtensionSupabase[];
}

const ExtensionsList: FC<ExtensionsListProps> = ({ enabledExtensions }) => {
  return (
    <div className="flex flex-col gap-8">
      {enabledExtensions.map(extension => {
        const ExtensionComponent = EXTENSION_COMPONENTS[extension.name];
        return ExtensionComponent ? <ExtensionComponent key={extension.name} /> : null;
      })}
    </div>
  );
};

export default ExtensionsList;
