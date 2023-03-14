import type { SystemUiInputProps } from "@components/UI/FormInput/styles";
import { input } from "@components/UI/FormInput/styles";
import type { SelectProps } from "react-html-props";
import styles from "./styles.module.css";

interface FormSelectProps extends SelectProps, SystemUiInputProps {
  hasError: boolean;
}

export const FormSelect = (props: FormSelectProps) => {
  const { className, hasError, scale, appearance, children, ...rest } = props;
  //@ts-ignore
  return (
    <div className={`${className ?? ""} relative`}>
      <select
        className={`w-full ${input({
          appearance: appearance ?? "square",
          scale: scale ?? "default",
          //@ts-ignore
          variant: hasError === true ? "error" : "default",
        })}`}
        {...rest}
      >
        {children}
      </select>
      <div
        className={`${styles.indicator} absolute inline-end-0 top-0 aspect-square rounded-ie-md h-full z-10 pointer-events-none bg-neutral-12 bg-opacity-5 border-is border-neutral-12 border-opacity-10`}
      />
    </div>
  );
};

export default FormSelect;
