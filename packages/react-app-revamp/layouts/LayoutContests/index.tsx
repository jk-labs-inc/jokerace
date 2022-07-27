import { ROUTE_VIEW_CONTESTS, ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_PAST_CONTESTS, ROUTE_VIEW_UPCOMING_CONTESTS } from "@config/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLayout as getBaseLayout } from "./../LayoutBase";

interface LayoutContestsProps {
  children: React.ReactNode
}

const navLinks = [
  {
    href: ROUTE_VIEW_CONTESTS,
    label: 'Search contests'
  },
  {
    href: ROUTE_VIEW_LIVE_CONTESTS,
    label: 'Live contests'
  },
  {
    href: ROUTE_VIEW_PAST_CONTESTS,
    label: 'Past contests'
  },
  {
    href: ROUTE_VIEW_UPCOMING_CONTESTS,
    label: 'Upcoming contests'
  }
]

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

      {children}
    </>
  );
};

export const getLayout = (page: any) => {
  return getBaseLayout(
    <LayoutContests>{page}</LayoutContests>
  )
};

export default LayoutContests;
