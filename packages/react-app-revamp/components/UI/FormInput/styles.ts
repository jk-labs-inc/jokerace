import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
// textual inputs (like textarea and text/number/url input)
export const input = cva(
  [
    'appearance-none',
    'border-solid border-true-white/10 disabled:border-true-white/20 disabled:hover:border-true-white/20 hover:border-true-white/25 focus:border-true-white/25',
    'bg-true-white/[0.035] focus:bg-true-white/[0.075]',
    'input placeholder:text-true-white/30',
    'disabled:opacity-50 disabled:pointer-events-none'
  ],
  {
    variants: {
      intent: {
        default: [
          'placeholder:text-true-white bg-true-white text-true-white border-true-white'
        ],
      'pseudo-disabled': 'placeholder:text-true-white bg-true-white text-true-white border-true-white opacity-50 pointer-events-none border-true-white/20 hover:border-true-white/20',
       error: [
        'input--invalid'
       ]
      },
      scale: {
        default: ['px-3 py-1.5 text-sm', 'border'],
        sm: ['px-3 py-0.5 text-sm', 'border'],
        md: ['px-4 py-1.5 text-md', 'border'],
      },
      appearance: {
        'square': 'rounded-md',
        'pill': 'rounded-full'
      }
    },
    defaultVariants: {
      intent: 'default',
      scale: 'default',
      appearance: 'square',
    },
  },
)

export type SystemUiInputProps = VariantProps<typeof input>

export default input