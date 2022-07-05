import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const loaderWrapper = cva(
    'text-center mx-auto',
    {
      variants: {
        scale: {
          page: ['pt-20'],
          component: ['pt-8'],
        },
      },
      defaultVariants: {
        scale: 'page',
      },
    },
  )

export const loaderIcon = cva(
  '',
  {
    variants: {
      scale: {
        page: ['text-7xl'],
        component: ['text-3xl'],
      },
    },
    defaultVariants: {
      scale: 'page',
    },
  },
)

export const loaderText = cva(
    'font-bold',
    {
      variants: {
        intent: {
            default: 'text-neutral-9'
        },
        scale: {
          page: ['text-lg'],
          component: ['text-sm'],
        },
      },
      defaultVariants: {
        scale: 'page',
        intent: 'default'
      },
    },
  )
  

export type LoaderStyleProps = VariantProps<typeof loaderIcon>
export type LoaderTextProps = VariantProps<typeof loaderText>
export type LoaderWrapperProps = VariantProps<typeof loaderWrapper>