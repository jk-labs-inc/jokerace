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

interface FormSearchContestProps {
  isInline?: boolean;
  onSubmit?: (address: string) => void;
}

export const FormSearchContest = (props: FormSearchContestProps) => {
  const { isInline, onSubmit } = props;
  const { activeChain } = useNetwork();
  const { asPath, push, pathname } = useRouter();
  const { form, errors } = useForm({
    extend: validator({ schema }),
    onSubmit: values => {
      const currentChain = asPath.split("/")[2];
      push(ROUTE_VIEW_CONTEST, `/contest/${currentChain ?? activeChain?.name.toLowerCase()}/${values.contestAddress}`, {
        shallow: true,
      });
      if (pathname !== ROUTE_VIEW_CONTESTS) {
        //@ts-ignore
        onSubmit(values.contestAddress);
      }
    },
  });
  const [buttonLabel, setButtonLabel] = useState("Search");
  useEffect(() => {
    setButtonLabel(!activeChain ? "Connect your wallet" : activeChain.unsupported ? "Unsupported network" : "Search");
  }, [activeChain]);
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
          disabled={!activeChain || activeChain.unsupported === true}
          scale={isInline ? "xs" : "default"}
          className={`${isInline ? "h-full whitespace-nowrap min-h-8" : " mx-auto mt-3"}`}
          intent="neutral-outline"
        >
          {buttonLabel}
        </Button>
      </form>
    </>
  );
};

export default FormSearchContest;
