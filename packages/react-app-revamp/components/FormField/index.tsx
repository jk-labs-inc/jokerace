import { ExclamationCircleIcon } from '@heroicons/react/outline'
import type { DivProps, LabelProps, PProps } from 'react-html-props'

interface FormFieldProps extends DivProps {
  disabled?: boolean
}
const FormField = (props: FormFieldProps) => {
    const { children, disabled } = props
  return (
    <div
      className={`flex flex-col ${disabled === true ? "opacity-50 cursor-not-allowed" : ""}`}

    >
      {children}
    </div>
  )
}

const InputField = (props: DivProps) => {
  const { children, className } = props
  return <div className={`flex flex-col ${className ?? ""}`}>{children}</div>
}

interface FormLabelProps extends LabelProps {
  hasError: boolean
}
const Label = (props: FormLabelProps) => {
  const { children, hasError, className, ...rest } = props
  return (
    <label className={`flex pb-2 font-bold text-neutral-12 items-center ${className ?? ""}`} {...rest}>
      {hasError && <ExclamationCircleIcon className="w-5 animate-appear text-negative-10 mie-1" />}
      {children}
    </label>
  )
}

const Description = (props: PProps) => {
  const { children, ...rest } = props
  return (
    <p className="sr-only" {...rest}>
      {children}
    </p>
  )
}

interface HelpBlockProps extends PProps{
  hasError: boolean
}

const HelpBlock = (props: HelpBlockProps) => {
    const { hasError, children, ...rest } = props
  return (
    <p
      className={`${hasError === true ? 'mt-1 text-xs text-negative-11' : 'sr-only'}`}
      {...rest}
    >
      {children}
    </p>
  )
}

FormField.InputField = InputField
FormField.Label = Label
FormField.Description = Description
FormField.HelpBlock = HelpBlock

export default FormField