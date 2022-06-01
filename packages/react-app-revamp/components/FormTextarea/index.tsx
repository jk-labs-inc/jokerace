import type { TextAreaProps } from 'react-html-props'

interface FormTextAreaProps extends TextAreaProps { }

export const FormTextarea = (props: FormTextAreaProps) => {
    const { className, ...rest } = props
    return <textarea {...rest} />
}

export default FormTextarea