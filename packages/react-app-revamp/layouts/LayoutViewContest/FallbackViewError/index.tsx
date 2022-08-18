import Button from "@components/Button"
import type { MouseEventHandler } from "react"

interface FallbackViewErrorProps {
  error: any
  resetErrorBoundary: MouseEventHandler<HTMLButtonElement> | undefined
}

export const FallbackViewError = (props: FallbackViewErrorProps) => {
  const { error, resetErrorBoundary } = props
  return (
    <div role="alert" className="container m-auto sm:text-center">
          <p className='text-4xl font-black mb-3 text-primary-10'>Something went wrong</p>
          {/*  eslint-disable-next-line react/no-unescaped-entities */}
          <p className='text-neutral-12 mb-6'>
            {error?.message ?? error}
          </p>
          <Button onClick={resetErrorBoundary}>
            Try again
          </Button>
    </div>
    
  )
}

export default FallbackViewError