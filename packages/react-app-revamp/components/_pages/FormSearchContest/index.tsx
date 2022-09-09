import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import Button from "@components/Button";
import FormInput from "@components/FormInput";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { schema } from "./schema";
import FormField from "@components/FormField";
import { ROUTE_VIEW_CONTEST, ROUTE_VIEW_CONTESTS } from "@config/routes";
import { useEffect, useState } from "react";
import { getNetwork } from "@wagmi/core";

interface FormSearchContestProps {
  isInline?: boolean;
  onSubmit?: (address: string, chainName?: string) => void;
  retry?: any;
}

export const FormSearchContest = (props: FormSearchContestProps) => {
  const { isInline, onSubmit } = props;
  const { chain } = useNetwork();
  const { asPath, push, pathname, events } = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const { form, errors, data } = useForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      const contestAddress = asPath.split("/")[3];
      if (chain?.unsupported === true) return;
      const currentChain = asPath.split("/")[2];
      const currentNetwork =  await getNetwork()
      ?.chain?.name.toLowerCase()
      .replace(" ", "")

      const chainName = !currentNetwork ? currentChain : currentNetwork
      push(
        ROUTE_VIEW_CONTEST,
        `/contest/${chainName}/${values.contestAddress}`,
        {
          shallow: true,
        },
      );
      if (contestAddress && contestAddress === values.contestAddress) return;
      if (pathname !== ROUTE_VIEW_CONTESTS) {
        //@ts-ignore
        onSubmit(values.contestAddress, chainName);
      }
    },
  });
  const [buttonLabel, setButtonLabel] = useState("Search");
  useEffect(() => {
    setButtonLabel(chain?.unsupported ? "Unsupported network" : "Search");
  }, [chain]);

  useEffect(() => {
    events.on("routeChangeStart", () => setShowLoader(true));
    events.on("routeChangeComplete", () => setShowLoader(false));
    events.on("routeChangeError", () => setShowLoader(false));
    return () => {
      events.off("routeChangeStart", () => setShowLoader(false));
      events.off("routeChangeComplete", () => setShowLoader(false));
      events.off("routeChangeError", () => setShowLoader(false));
    };
  }, []);

  return (
    <>
      <form
        ref={form}
        className={`flex ${!isInline ? "flex-col" : "items-center space-i-2 justify-center"}`}
        role="search"
      >
        <FormField className={isInline ? "w-full h-full min-h-8" : ""}>
          <label htmlFor="contestAddress" className="sr-only">
            Contest address
          </label>
          <FormInput
            required
            className={`w-full ${isInline ? "h-full" : "mx-auto xs:max-w-[55ex]"}`}
            scale={isInline ? "sm" : "md"}
            appearance="pill"
            placeholder="Search contract address (0x...)"
            aria-invalid={errors().contestAddress?.length > 0 === true ? "true" : "false"}
            name="contestAddress"
            id="contestAddress"
            hasError={errors().contestAddress?.length > 0 === true}
            aria-describedby="input-contestaddress-helpblock"
          />
          <FormField.HelpBlock
            className={`${isInline ? "sr-only" : "text-center text-2xs"}`}
            hasError={errors().contestAddress?.length > 0 === true}
            id="input-contestaddress-helpblock"
          >
            Please type a valid Ethereum address.
          </FormField.HelpBlock>
        </FormField>

        <Button
          isLoading={showLoader}
          scale={isInline ? "xs" : "default"}
          className={`${isInline ? "h-full whitespace-nowrap min-h-8" : " mx-auto mt-3"} ${
            (showLoader || data()?.contestAddress === '' || errors().contestAddress?.length > 0 === true || chain?.unsupported === true) ? "pointer-events-none opacity-50" : ""
          }`}
          intent="neutral-outline"
          disabled={(!asPath.includes('/contest/') && (!chain || chain?.unsupported === true)) || (data()?.contestAddress === '' || errors().contestAddress?.length > 0 === true || chain?.unsupported === true)}
        >
          {(!asPath.includes('/contest/') && (!chain || chain?.unsupported === true)) ? 'Connect your wallet' : buttonLabel}
        </Button>
      </form>
    </>
  );
};

export default FormSearchContest;
