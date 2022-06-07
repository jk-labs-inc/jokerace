import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const formFieldLabel = cva(
  ['flex font-bold items-center'],
  {
    variants: {
      intent: {
        default: ['text-neutral-12'],
      },
      size: {
        default: ['pb-2'],
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'default',
    },
  },
)

export type SystemUiButtonProps = VariantProps<typeof formFieldLabel>

