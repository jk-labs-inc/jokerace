import { useExtensions } from "@hooks/useExtensions";
import BelloExtension from "./Bello";
import HatsProtocolExtension from "./HatsProtocol";
import NanceExtension from "./Nance";
import CoinviseExtension from "./Coinvise";

type ExtensionComponentMap = {
  [key: string]: React.ComponentType<any>;
};

const EXTENSION_COMPONENTS: ExtensionComponentMap = {
  "hats-protocol": HatsProtocolExtension,
  bello: BelloExtension,
  nance: NanceExtension,
  coinvise: CoinviseExtension,
};

const ExtensionsList = () => {
  const { enabledExtensions, isLoading, isError } = useExtensions();

  if (isLoading) return <p className="loadingDots font-sabo text-[16px] text-neutral-14">loading extensions</p>;
  if (isError)
    return (
      <p className="text-negative-11 font-bold text-[16px]">
        ruh-roh! there was an error while fetching extensions, please reload the page!
      </p>
    );

  if (!enabledExtensions) return <div>No extensions enabled.</div>;

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
