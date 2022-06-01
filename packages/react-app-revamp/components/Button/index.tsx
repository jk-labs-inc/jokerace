import button from './styles'
import type { ButtonProps as HtmlButtonProps } from 'react-html-props'
import { IconSpinner } from '@components/Icons'

interface ButtonProps extends HtmlButtonProps {
    intent?: string
    size?: string
    isLoading?: boolean
}

export const Button = (props: ButtonProps) => {
  const { children, size, intent, isLoading, className, ...rest } = props 
  return (
    <button
      className={button({ intent: intent ?? 'primary', size: size ?? 'default', class: className ?? '' })}
      aria-disabled={props.disabled || isLoading === true}
      {...rest}
    >
      {isLoading && <IconSpinner className="animate-spin mie-1ex" />}
      {children}
    </button>
  )
}

export default Button