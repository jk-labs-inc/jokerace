import Button from "@components/UI/Button";
import {
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
  ROUTE_VIEW_PAST_CONTESTS,
  ROUTE_VIEW_UPCOMING_CONTESTS,
} from "@config/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getLayout as getBaseLayout } from "./../LayoutBase";

interface LayoutContestsProps {
  children: React.ReactNode;
}

const navLinks = [
  {
    href: ROUTE_VIEW_CONTESTS,
    label: "Search",
  },
  {
    href: ROUTE_VIEW_LIVE_CONTESTS,
    label: "Live",
  },
  {
    href: ROUTE_VIEW_PAST_CONTESTS,
    label: "Past",
  },
  {
    href: ROUTE_VIEW_UPCOMING_CONTESTS,
    label: "Upcoming",
  },
];

const LayoutContests = (props: LayoutContestsProps) => {
  const { children } = props;
  const { pathname } = useRouter();
  const [activeTab, setActiveTab] = useState(pathname);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeTabIndex = navLinks.findIndex(link => link.href === activeTab);
    const activeTabRef = tabRefs.current[activeTabIndex];

    if (activeTabRef) {
      setIndicatorStyle({
        left: `${activeTabRef.offsetLeft}px`,
        width: `${activeTabRef.offsetWidth}px`,
      });
    }
  }, [activeTab]);

  return (
    <>
      <div className="relative mt-6 flex-col gap-2">
        <div className="flex gap-4 justify-center mb-4 px-2 sm:gap-8 sm:px-0">
          {navLinks.map((link, index) => (
            <Link href={link.href} key={link.href}>
              <div
                ref={el => (tabRefs.current[index] = el)}
                className={`navLink-desktop whitespace-nowrap font-sabo text-[16px] sm:text-[20px] cursor-pointer transition-colors duration-200 ${
                  activeTab === link.href ? "text-primary-10" : "text-neutral-11"
                }`}
                onClick={() => setActiveTab(link.href)}
              >
                {link.label}
              </div>
            </Link>
          ))}
          <div className="absolute left-0 w-full h-1 bottom-0 bg-neutral-0"></div>
          <div style={indicatorStyle} className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"></div>
        </div>
      </div>

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

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutContests>{page}</LayoutContests>);
};

export default LayoutContests;
