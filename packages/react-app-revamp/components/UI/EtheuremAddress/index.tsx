import { shortenEthereumAddress } from "@helpers/shortenEthereumAddress";
import { getDefaultProfile } from "@services/lens/getDefaultProfile";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { chain, useEnsName } from "wagmi";

interface EtheuremAddressProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  displayLensProfile: boolean;
  withHyphen: boolean;
}
export const EtheuremAddress = (props: EtheuremAddressProps) => {
  const { ethereumAddress, displayLensProfile, shortenOnFallback, withHyphen } = props;
  const queryUserProfileLens = useQuery(
    ["lens-profile", ethereumAddress],
    async () => {
      try {
        const result = await getDefaultProfile({
          ethereumAddress,
        });
        //@ts-ignore
        if (result?.error) throw new Error(result?.error);
        return result?.data?.defaultProfile;
      } catch (e) {
        console.error(e);
      }
    },
    {
      enabled: displayLensProfile,
    },
  );

  const queryEns = useEnsName({
    chainId: chain.mainnet.id,
    address: ethereumAddress,
    enabled:
      (queryUserProfileLens?.isSuccess && queryUserProfileLens?.data === null) || queryUserProfileLens?.isError
        ? true
        : false,
  });

  if (!displayLensProfile || queryUserProfileLens?.status === "error" || queryUserProfileLens?.data === null) {
    if (queryEns?.status === "success" && queryEns?.data !== null)
      return <>{`${withHyphen === true ? "— " : ""}${queryEns?.data}`}</>;
    return (
      <>
        {shortenOnFallback === true
          ? `${withHyphen === true ? "— " : ""}${shortenEthereumAddress(ethereumAddress)}`
          : `${withHyphen === true ? "— " : ""}${ethereumAddress}`}
      </>
    );
  }

  if (queryUserProfileLens?.status === "loading")
    return <>Loading {shortenEthereumAddress(ethereumAddress)} profile data...</>;
  if (queryUserProfileLens?.status === "success" && queryUserProfileLens?.data !== null)
    return (
      <span className="flex items-baseline 2xs:items-center">
        {withHyphen ? "—" : ""}
        <a
          title={`View ${queryUserProfileLens?.data?.name}'s profile on LensFrens`}
          className={`relative flex flex-col 2xs:flex-row 2xs:items-center flex-grow z-20 ${withHyphen ? "pis-3" : ""}`}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://lensfrens.xyz/${queryUserProfileLens?.data?.handle}`}
        >
          {queryUserProfileLens?.data?.picture?.original?.url && (
            <div className="shrink-0 w-10 h-10 mb-3 2xs:mb-0 2xs:mie-3 bg-neutral-5 rounded-full overflow-hidden">
              <Image
                width={100}
                height={100}
                className="w-full h-full object-cover"
                src={queryUserProfileLens?.data?.picture?.original?.url?.replace(
                  "ipfs://",
                  "https://lens.infura-ipfs.io/ipfs/",
                )}
                alt=""
              />
            </div>
          )}

          <span className="flex flex-wrap whitespace-pre-line">
            <span className="font-bold w-full">{queryUserProfileLens?.data?.name}&nbsp;</span>
            <span className="text-[0.9em] opacity-50">@{queryUserProfileLens?.data?.handle}</span>
          </span>
        </a>
      </span>
    );
  return <>{ethereumAddress}</>;
};

export default EtheuremAddress;
