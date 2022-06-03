import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
// textual inputs (like textarea and text/number/url input)
export const input = cva(
  [
    'appearance-none',
    'border-solid border-opacity-10 disabled:border-opacity-20 disabled:hover:border-opacity-20 hover:border-opacity-25 focus:border-opacity-25',
    'bg-opacity-3.5 focus:bg-opacity-7.5',
    'input placeholder:text-opacity-50',
    'disabled:opacity-50 disabled:pointer-events-none'
  ],
  {
    variants: {
      intent: {
        default: [
          'bg-true-white border-true-white'
        ],
       error: [
        'input--invalid'
       ]
      },
      size: {
        default: ['px-3 py-1.5 text-sm rounded-md', 'border'],
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'default',
    },
  },
)

export type SystemUiButtonProps = VariantProps<typeof input>

export default input