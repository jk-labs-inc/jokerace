import input from "@components/UI/FormInput/styles";
import type { TextAreaProps } from "react-html-props";
interface FormTextAreaProps extends TextAreaProps {
  hasError: boolean;
}

export const FormTextarea = (props: FormTextAreaProps) => {
  const { className, hasError, ...rest } = props;
  return (
    <textarea
      //@ts-ignore
      className={input({ scale: "default", variant: hasError === true ? "error" : "default", class: className ?? "" })}
      {...rest}
    />
  );
};

export default FormTextarea;
