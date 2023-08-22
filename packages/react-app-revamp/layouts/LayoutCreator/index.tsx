import Button from "@components/UI/Button";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getLayout as getBaseLayout } from "./../LayoutBase";

interface LayoutCreatorProps {
  children: ReactNode;
}

const LayoutCreator = (props: LayoutCreatorProps) => {
  const { children } = props;

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div role="alert" className="container m-auto sm:text-center">
          <p className="text-4xl font-black mb-3 text-primary-10">Something went wrong</p>
          <p className="text-neutral-12 mb-4">{error?.message ?? error}</p>
          <p className="mb-6">
            This site&apos;s current deployment does not have access to jokerace&apos;s reference database of contests,
            but you can check out our Supabase backups{" "}
            <a
              className="link px-1ex"
              href="https://github.com/jk-labs-inc/jokerace/tree/staging/packages/supabase"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{" "}
            for contest chain and address information!
          </p>
          <Button onClick={resetErrorBoundary}>Try loading live contests again</Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutCreator>{page}</LayoutCreator>);
};

export default LayoutCreator;
