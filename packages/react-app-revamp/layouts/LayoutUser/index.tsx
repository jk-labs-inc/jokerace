import Button from "@components/UI/Button";
import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_VIEW_USER, ROUTE_VIEW_USER_SUBMISSIONS, ROUTE_VIEW_USER_VOTING } from "@config/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface LayoutUserProps {
  address: string;
  children: ReactNode;
}

const navLinks = [
  {
    href: ROUTE_VIEW_USER,
    label: "Contests",
  },
  {
    href: ROUTE_VIEW_USER_SUBMISSIONS,
    label: "Submissions",
  },
  {
    href: ROUTE_VIEW_USER_VOTING,
    label: "Votes",
  },
];

const LayoutUser = (props: LayoutUserProps) => {
  const { children, address } = props;
  const { pathname } = useRouter();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeTabIndex = navLinks.findIndex(link => link.href === pathname);
    const activeTabRef = tabRefs.current[activeTabIndex];

    if (activeTabRef) {
      setIndicatorStyle({
        left: `${activeTabRef.offsetLeft}px`,
        width: `${activeTabRef.offsetWidth}px`,
      });
    }
  }, [pathname]);

  return (
    <>
      <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
        <div className="container mx-auto mt-12">
          {!address ? (
            <div className="flex items-center gap-6">
              <Skeleton circle height={100} width={100} />
              <Skeleton height={24} width={200} />
            </div>
          ) : (
            <EthereumAddress ethereumAddress={address} shortenOnFallback isLarge includeSocials />
          )}

          <div className="relative mt-12 flex-col gap-2">
            <div className="flex gap-4 justify-start mb-4 sm:gap-8 sm:px-0">
              {navLinks.map((link, index) => (
                <Link href={link.href.replace("[address]", address)} key={link.href}>
                  <div
                    ref={el => (tabRefs.current[index] = el)}
                    className={`font-sabo py-2 text-[16px] sm:text-[20px] cursor-pointer transition-colors duration-200 ${
                      pathname === link.href ? "text-primary-10" : "text-neutral-11"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="absolute left-0 w-full h-1 bottom-0 bg-neutral-0"></div>
              <div
                style={indicatorStyle}
                className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"
              ></div>
            </div>
          </div>
        </div>
      </SkeletonTheme>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert" className="container m-auto sm:text-center">
            <p className="text-4xl font-black mb-3 text-primary-10">Something went wrong</p>
            <p className="text-neutral-12 mb-4">{error?.message ?? error}</p>
            <p className="mb-6">
              This site&apos;s current deployment does not have access to jokerace&apos;s reference database of
              contests, but you can check out our Supabase backups{" "}
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
    </>
  );
};

export default LayoutUser;
