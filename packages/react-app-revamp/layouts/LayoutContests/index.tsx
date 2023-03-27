import Button from "@components/UI/Button";
import {
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
  ROUTE_VIEW_PAST_CONTESTS,
  ROUTE_VIEW_UPCOMING_CONTESTS,
} from "@config/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";
import { getLayout as getBaseLayout } from "./../LayoutBase";

interface LayoutContestsProps {
  children: React.ReactNode;
}

const navLinks = [
  {
    href: ROUTE_VIEW_CONTESTS,
    label: "Search contests",
  },
  {
    href: ROUTE_VIEW_LIVE_CONTESTS,
    label: "Live contests",
  },
  {
    href: ROUTE_VIEW_PAST_CONTESTS,
    label: "Past contests",
  },
  {
    href: ROUTE_VIEW_UPCOMING_CONTESTS,
    label: "Upcoming contests",
  },
];

const LayoutContests = (props: LayoutContestsProps) => {
  const { children } = props;
  const { pathname } = useRouter();

  return (
    <>
      <div className="pt-2">
        <nav className="pb-1 px-3 flex items-center justify-between text-sm sm:container sm:mx-auto overflow-x-auto max-w-screen">
          {navLinks.map(el => (
            <Link href={el.href} key={el.href}>
              <a
                className={`navLink-desktop whitespace-nowrap ${
                  pathname === el.href ? "navLink-desktop--active" : "navLink-desktop--inactive"
                }`}
              >
                {el.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert" className="container m-auto sm:text-center">
            <p className="text-4xl font-black mb-3 text-primary-10">Something went wrong</p>
            {/*  eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-neutral-12 mb-4">{error?.message ?? error}</p>
            <p className="mb-6">
              This site&apos;s current deployment does not have access to jokedao&apos;s reference database of contests,
              but you can check out our Supabase backups{" "}
              <a
                className="link px-1ex"
                href="https://github.com/JokeDAO/JokeDaoV2Dev/tree/staging/packages/supabase"
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
