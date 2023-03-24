import Button from "@components/UI/Button";
import FormField from "@components/UI/FormField";
import FormInput from "@components/UI/FormInput";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { FC, useState } from "react";
import { schema } from "./schema";

interface FormSearchContestProps {
  isInline?: boolean;
  onSubmitTitle?: (title: string) => void;
}

export const FormSearchContest: FC<FormSearchContestProps> = ({ isInline, onSubmitTitle }) => {
  const { form, errors, data } = useForm({
    extend: validator({ schema }),
    onSubmit: async values => {
      onSubmitTitle?.(values.contestTitle);
    },
  });

  return (
    <form
      ref={form}
      className={`flex ${!isInline ? "flex-col" : "items-center space-i-2 justify-center"}`}
      role="search"
    >
      <FormField className={isInline ? "w-full h-full min-h-8" : ""}>
        <label htmlFor="contestTitle" className="sr-only">
          Contest address
        </label>
        <FormInput
          required
          className={`w-full ${isInline ? "h-full" : "mx-auto xs:max-w-[55ex]"}`}
          scale={isInline ? "sm" : "md"}
          appearance="pill"
          placeholder="Search by contest title"
          aria-invalid={errors().contestTitle?.length > 0 ? "true" : "false"}
          name="contestTitle"
          id="contestTitle"
          hasError={errors().contestTitle?.length > 0}
        />
      </FormField>

      <Button
        scale={isInline ? "xs" : "default"}
        className={`${isInline ? "h-full whitespace-nowrap min-h-8" : " mx-auto mt-3"} ${
          data()?.contestTitle === "" || errors().contestTitle?.length > 0 ? "pointer-events-none opacity-50" : ""
        }`}
        intent="neutral-outline"
      >
        Search
      </Button>
    </form>
  );
};

export default FormSearchContest;
