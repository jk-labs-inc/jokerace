import button from './styles'
import { IconSpinner } from '@components/Icons'
import type { ButtonProps as HtmlButtonProps } from 'react-html-props'
import type { SystemUiButtonProps } from './styles'

interface ButtonProps extends HtmlButtonProps, SystemUiButtonProps {
    isLoading?: boolean
}

export const Button = (props: ButtonProps) => {
  const { children, scale, intent, isLoading, className, ...rest } = props 
  return (
    <button
      className={button({ intent: intent ?? 'primary', scale: scale ?? 'default', class: className ?? '' })}
      aria-disabled={props.disabled || isLoading === true}
      {...rest}
    >
      {isLoading && <IconSpinner className="animate-spin mie-1ex" />}
      {children}
    </button>
  )
}

export default Button