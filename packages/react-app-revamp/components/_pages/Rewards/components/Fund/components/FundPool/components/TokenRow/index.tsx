import ButtonV3 from "@components/UI/ButtonV3";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { isTokenShorthand } from "@helpers/isTokenShorthand";
import { MediaQuery } from "@helpers/mediaQuery";
import CHAIN_CONFIGS, { TokenConfig } from "@helpers/tokens";
import { Reward, useFundRewardsStore } from "@hooks/useFundRewards/store";
import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import CreateRewardsFundPoolDesktopLayout from "./DesktopLayout";
import CreateRewardsFundPoolMobileLayout from "./MobileLayout";

type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

const formatNativeToken = (nativeToken?: NativeCurrency): TokenConfig | undefined => {
  if (!nativeToken) return undefined;

  return {
    symbol: nativeToken.symbol,
    name: nativeToken.name,
    address: "",
  };
};

const CreateRewardsFundPoolTokenRow = () => {
  const { asPath } = useRouter();
  const { chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const { setRewards, setValidationError } = useFundRewardsStore(state => state);
  const [rows, setRows] = useState<Reward[]>([{ address: "", amount: "" }]);
  const chainConfig = Object.values(CHAIN_CONFIGS).find(config => config.id === chainId);
  const nativeToken: NativeCurrency | undefined = chains.find(
    (chain: { id: number }) => chain.id === chainId,
  )?.nativeCurrency;
  const nativeTokenConfig = formatNativeToken(nativeToken);
  const allTokens = (nativeTokenConfig ? [nativeTokenConfig] : []).concat(chainConfig?.tokens || []);

  const validateAndSetRewards = (newRows: Reward[]) => {
    setRewards(newRows);
    const errors = newRows.map((row: { address: string; amount: string }, index: any) => {
      let error = {};

      if (!row.address && (!row.amount || parseFloat(row.amount) === 0)) {
        return error;
      }

      try {
        if (!isTokenShorthand(allTokens, row.address)) {
          getAddress(row.address);
        }
      } catch {
        error = { ...error, tokenAddress: "Invalid Ethereum address." };
      }

      if (row.address && (!row.amount || parseFloat(row.amount) <= 0)) {
        error = { ...error, amount: "Token amount should not be zero." };
      }

      return error;
    });

    const hasErrors = errors.some(error => Object.keys(error).length !== 0);
    setValidationError(hasErrors ? errors : []);
  };

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const values = [...rows];
    const { name, value } = event.target;
    values[index] = { ...values[index], [name]: value };
    setRows(values);

    validateAndSetRewards(values);
  };

  const handleAddField = () => {
    const newRows = [...rows, { address: "", amount: "" }];
    setRows(newRows);

    validateAndSetRewards(newRows);
  };

  const handleTokenClick = (index: number, token: TokenConfig) => {
    const values = [...rows];
    if (!token.address) {
      values[index].address = `$${token.symbol}`;
    } else {
      values[index].address = token.address;
    }

    setRows(values);
    validateAndSetRewards(values);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
      validateAndSetRewards(newRows);
    }
  };

  return (
    <div>
      <MediaQuery maxWidth={750}>
        <CreateRewardsFundPoolMobileLayout
          rows={rows}
          allTokens={allTokens}
          chainName={chainName}
          handleInputChange={handleInputChange}
          handleRemoveRow={handleRemoveRow}
          handleTokenClick={handleTokenClick}
        />
      </MediaQuery>
      <MediaQuery minWidth={751}>
        <CreateRewardsFundPoolDesktopLayout
          rows={rows}
          allTokens={allTokens}
          chainName={chainName}
          handleInputChange={handleInputChange}
          handleRemoveRow={handleRemoveRow}
          handleTokenClick={handleTokenClick}
        />
      </MediaQuery>
      <div className="flex justify-end md:rewards-funding-grid">
        <div className="col-start-4 col-span-1 justify-self-end mt-[15px] md:-mt-[5px]">
          <ButtonV3 onClick={handleAddField} colorClass="bg-primary-10">
            + add token
          </ButtonV3>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsFundPoolTokenRow;
