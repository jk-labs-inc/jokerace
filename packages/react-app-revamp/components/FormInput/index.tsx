import type { InputProps } from 'react-html-props'
import { input } from './styles'

interface FormInputProps extends InputProps {
    hasError: boolean
}

export const FormInput = (props: FormInputProps) => {
    const { className, hasError, size, ...rest } = props
    return <input className={input({ size: size ?? 'default', variant: hasError === true ? 'error' : 'default', class: className ?? ''})} {...rest} />
}

export default FormInput