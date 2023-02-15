import Button from "@components/Button";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon, ExclamationIcon, ShieldExclamationIcon } from "@heroicons/react/outline";
import { parseUnits } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useId } from "react";
import { useAccount, useBalance, useNetwork, useToken } from "wagmi";
import { schema } from "./schema";

interface FormProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: any;
  handleSubmit: (args: {
    currentUserAddress: string;
    erc20TokenAddress: string;
    isErc20: boolean;
    amount: string;
  }) => Promise<void>;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const Form = (props: FormProps) => {
  const formId = useId();
  const { isLoading, isError, isSuccess, handleSubmit, setIsModalOpen } = props;
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { query } = useRouter();
  const { form, setData, data, errors, isValid } = useForm({
    extend: validator({ schema }),
    initialValues: {
      isErc20: query?.tokenRewardsAddress === "native" ? false : true,
      tokenRewardsAddress:
        query?.tokenRewardsAddress && query?.tokenRewardsAddress !== "native" ? query?.tokenRewardsAddress : "",
      //@ts-ignore
      amount: parseFloat(query?.totalRewards ? query?.totalRewards : 0),
    },
    onSubmit: values => {
      handleSubmit({
        //@ts-ignore
        currentUserAddress: address,
        isErc20: values.isErc20,
        //@ts-ignore
        erc20TokenAddress: values.tokenRewardsAddress,
        //@ts-ignore
        amount: parseUnits(`${values.amount}`, balance.data?.decimals),
      });
    },
  });
  const erc20TokenRewards = useToken({
    //@ts-ignore
    address: data()?.tokenRewardsAddress,
    //@ts-ignore
    enabled: address && data()?.isErc20 && data()?.tokenRewardsAddress && data()?.tokenRewardsAddress !== "",
  });
  const balance = useBalance({
    addressOrName: address,
    //@ts-ignore
    enabled: address && (!data()?.isErc20 || (data()?.isErc20 && erc20TokenRewards?.data?.address)) ? true : false,
    //@ts-ignore
    token: data()?.isErc20 ? data()?.tokenRewardsAddress : undefined,
  });

  useEffect(() => {
    const refetchBalance = async () => {
      await balance.refetch();
    };
    if (isSuccess === true) {
      refetchBalance();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (query?.tokenRewardsAddress === "native") setData("isErc20", false);
  }, [query?.tokenRewardsAddress]);
  return (
    <form ref={form} id={formId}>
      <fieldset className="mb-6">
        <div className="space-y-4">
          <RadioGroup
            className="overflow-hidden text-xs font-medium mb-6 divide-i divide-neutral-4 flex rounded-full border-solid border border-neutral-4"
            value={data()?.isErc20}
            onChange={(e: boolean) => {
              setData("isErc20", e);
              if (e === false) {
                setData("tokenRewardsAddress", "");
              }
            }}
          >
            <RadioGroup.Option className="relative w-1/2 p-1 flex items-center justify-center" value={true}>
              {({ checked }) => (
                <>
                  <span
                    className={`${
                      checked ? "bg-positive-9" : ""
                    } cursor-pointer absolute top-0 left-0 w-full h-full block`}
                  />
                  <span
                    className={`cursor-pointer normal-case relative z-10 ${checked ? "text-positive-1 font-bold" : ""}`}
                  >
                    ERC20
                  </span>
                </>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option className="relative w-1/2 p-1 flex items-center justify-center" value={false}>
              {({ checked }) => (
                <>
                  <span
                    className={`${
                      checked ? "bg-positive-9" : ""
                    } cursor-pointer absolute top-0 left-0 w-full h-full block`}
                  />
                  <span
                    className={`cursor-pointer normal-case relative z-10 ${checked ? "text-positive-1 font-bold" : ""}`}
                  >
                    {chain?.nativeCurrency?.symbol}
                  </span>
                </>
              )}
            </RadioGroup.Option>
          </RadioGroup>{" "}
          {data()?.isErc20 && (
            <FormField disabled={!isConnected || chain?.unsupported === true || isLoading === true}>
              <FormField.InputField>
                <FormField.Label
                  className="text-sm"
                  hasError={errors().tokenRewardsAddress?.length > 0 === true}
                  htmlFor="tokenRewardsAddress"
                >
                  Address of token used for rewards
                </FormField.Label>
                <FormField.Description id="input-tokenRewardsAddress-description">
                  The Ethereum address of the ERC20 token you want to give as a reward.
                </FormField.Description>
                <FormInput
                  required
                  disabled={!isConnected || chain?.unsupported === true || isLoading === true}
                  aria-invalid={
                    errors().tokenRewardsAddress?.length > 0 === true || erc20TokenRewards?.isError ? "true" : "false"
                  }
                  className="max-w-full w-auto 2xs:w-full"
                  placeholder="0x..."
                  type="text"
                  id="tokenRewardsAddress"
                  name="tokenRewardsAddress"
                  hasError={errors().tokenRewardsAddress?.length > 0 === true || erc20TokenRewards?.isError}
                  aria-describedby="input-tokenRewardsAddress-description input-tokenRewardsAddress-note input-tokenRewardsAddress-helpblock"
                />
              </FormField.InputField>
              {erc20TokenRewards?.data && (
                <div className="pt-2 flex items-center">
                  <CheckIcon className="mie-2 w-5 shrink-0 text-positive-11" />
                  <p className="text-neutral-11 text-2xs normal-case font-bold">
                    {erc20TokenRewards?.data?.name} (${erc20TokenRewards?.data?.symbol})
                  </p>
                </div>
              )}
              {erc20TokenRewards?.isError && (
                <div className="pt-2 flex items-center">
                  <ExclamationIcon className="mie-2 w-5 shrink-0 text-negative-11" />
                  <p className="text-negative-11 text-2xs">{erc20TokenRewards?.error?.message}</p>{" "}
                </div>
              )}
              {!erc20TokenRewards?.data && (
                <p
                  id="input-tokenRewardsAddress-note"
                  className="text-2xs pt-2 text-secondary-11 flex flex-wrap items-center"
                >
                  <ShieldExclamationIcon className="text-secondary-11 mie-1ex w-5" />
                  The token must implement the &nbsp;
                  <span className="font-mono normal-case">ERC20</span>&nbsp; interface <br />
                  <a
                    target="_blank"
                    rel="nofollow noreferrer"
                    href="https://metamask.zendesk.com/hc/en-us/articles/360059683451-How-to-find-a-token-contract-address"
                  >
                    Check this article to know out how to find a ERC20 token address
                  </a>
                </p>
              )}
              <FormField.HelpBlock
                hasError={errors().tokenRewardsAddress?.length > 0 === true}
                id="input-tokenRewardsAddress-helpblock"
              >
                The reward token address must be a valid Ethereum address
              </FormField.HelpBlock>
            </FormField>
          )}
          {balance?.data?.formatted && (
            <FormField disabled={!isConnected || chain?.unsupported === true || isLoading === true}>
              <FormField.InputField>
                {/* @ts-ignore */}
                <FormField.Label
                  hasError={
                    errors().amount?.length > 0 === true ||
                    data()?.amount >
                      (balance?.data?.decimals === 18
                        ? balance?.data?.formatted
                        : //@ts-ignore
                          10 ** (18 - balance.data.decimals) * balance.data.formatted)
                  }
                  htmlFor="amount"
                >
                  Amount
                </FormField.Label>
                <FormField.Description id="input-amount-description">
                  The amount of tokens you want to send to the rewards module
                </FormField.Description>
                <FormInput
                  required
                  disabled={
                    !isConnected ||
                    chain?.unsupported === true ||
                    isLoading === true ||
                    (data()?.isErc20 && !erc20TokenRewards?.data?.address)
                  }
                  /* @ts-ignore */
                  aria-invalid={
                    errors().amount?.length > 0 === true ||
                    data()?.amount >
                      (balance?.data?.decimals === 18
                        ? balance?.data?.formatted
                        : //@ts-ignore
                          10 ** (18 - balance.data.decimals) * balance.data.formatted)
                      ? "true"
                      : "false"
                  }
                  className="max-w-full w-auto 2xs:w-full"
                  type="number"
                  step="any"
                  min={0}
                  /* @ts-ignore */
                  max={
                    balance?.data?.decimals === 18
                      ? balance?.data?.formatted
                      : //@ts-ignore
                        10 ** (18 - balance.data.decimals) * balance.data.formatted
                  }
                  id="amount"
                  name="amount"
                  hasError={errors().amount?.length > 0 === true}
                  aria-describedby="input-amount-description input-amount-balance-helpblock input-amount-helpblock"
                />
              </FormField.InputField>
              {balance?.data?.formatted && (
                <p
                  id="input-amount-balance-helpblock"
                  className="pt-2 text-2xs text-neutral-11 font-bold flex flex-wrap items-center"
                >
                  {/* @ts-ignore */}
                  Current {balance?.data?.symbol} balance:{" "}
                  {balance?.data?.decimals === 18
                    ? balance?.data?.formatted
                    : //@ts-ignore
                      10 ** (18 - balance.data.decimals) * balance.data.formatted}
                </p>
              )}
              {/* @ts-ignore */}

              <FormField.HelpBlock
                hasError={
                  errors().amount?.length > 0 === true ||
                  data()?.amount >
                    (balance?.data?.decimals === 18
                      ? balance?.data?.formatted
                      : //@ts-ignore
                        10 ** (18 - balance.data.decimals) * balance.data.formatted)
                }
                id="input-amount-helpblock"
              >
                The amount of tokens must be positive and inferior or equal to your balance.
              </FormField.HelpBlock>
            </FormField>
          )}
        </div>
      </fieldset>
      <div className="mb-4 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          className="sm:w-fit-content"
          isLoading={isLoading === true || isLoading}
          //@ts-ignore
          disabled={
            !isValid() ||
            isLoading ||
            !isConnected ||
            chain?.unsupported === true ||
            (data()?.isErc20 === true && !erc20TokenRewards?.data) ||
            /*@ts-ignore */
            data()?.amount >
              (balance?.data?.decimals === 18
                ? balance?.data?.formatted
                : //@ts-ignore
                  10 ** (18 - balance.data.decimals) * balance.data.formatted)
          }
          type="submit"
        >
          {isError ? "Try again" : "Send"}
        </Button>
        <Button intent="neutral-outline" type="button" onClick={() => setIsModalOpen(false)}>
          Go back
        </Button>
      </div>
    </form>
  );
};

export default Form;
