import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import Button from "@components/Button";
import FormInput from "@components/FormInput";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { schema } from "./schema";
import FormField from "@components/FormField";

export const FormSearchContest = () => {
  const { activeChain } = useNetwork();
  const router = useRouter();
  const { form, errors, isValid, interacted } = useForm({
    extend: validator({ schema }),
    onSubmit: values => router.push(`/contest/${activeChain?.name.toLocaleLowerCase()}/${values.contestAddress}`),
  });

  return (
    <>
      <form ref={form} className="flex flex-col" role="search">
        <FormField>
          <label htmlFor="contestAddress" className="sr-only">
            Contest address
          </label>
          <FormInput
            required
            className="w-full mx-auto xs:max-w-[55ex]"
            scale="md"
            appearance="pill"
            placeholder="Search contract address (0x...)"
            aria-invalid={errors().contestAddress?.length > 0 === true ? "true" : "false"}
            name="contestAddress"
            id="contestAddress"
            hasError={errors().contestAddress?.length > 0 === true}
            aria-describedby="input-contestaddress-helpblock"
          />
          <FormField.HelpBlock
            className="text-center"
            hasError={errors().contestAddress?.length > 0 === true}
            id="input-contestaddress-helpblock"
          >
            Please type a valid Ethereum address.
          </FormField.HelpBlock>
        </FormField>

        <Button
          disabled={isValid() === false || interacted() === null}
          className="mx-auto mt-3"
          intent="neutral-outline"
        >
          Search
        </Button>
      </form>
    </>
  );
};

export default FormSearchContest;
