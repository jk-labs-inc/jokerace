import { forwardRef, Fragment } from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import {
  ROUTE_CONTEST_PROPOSAL,
  ROUTE_CREATE_CONTEST,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_CONTEST_RULES,
} from "@config/routes";
import { FOOTER_LINKS } from "@config/links";
import { Menu, Transition } from "@headlessui/react";
import { XIcon, MenuIcon } from "@heroicons/react/solid";
import { IconPoweredByVercel } from "@components/Icons";

interface MenuLinkBaseProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
}
// eslint-disable-next-line react/display-name
const MenuLink = forwardRef((props: MenuLinkBaseProps, ref) => {
  const { href, children, active, ...rest } = props;
  const { pathname } = useRouter();
  return (
    <Link href={href}>
      <a
        className={`navLink-mobile ${
          active || pathname === href
            ? "bg-true-white bg-opacity-5 focus:bg-primary-2 text-primary-10"
            : "focus:bg-true-white focus:bg-opacity-5"
        }`}
        //@ts-ignore
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
});

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = (props: LayoutBaseProps) => {
  const { children } = props;
  const { pathname } = useRouter();

  return (
    <>
      <header className="relative z-20 border-b border-neutral-2 border-solid">
        <div className="py-2 container flex items-center mx-auto">
          <Link href="/">
            <a className="text-4xl xs:text-xl">
              🃏 <span className="sr-only">Home</span>
            </a>
          </Link>
          <nav className="hidden xs:flex xs:mis-4 space-i-0.5">
            <Link href={ROUTE_CREATE_CONTEST}>
              <a
                className={`navLink-desktop ${
                  pathname === ROUTE_CREATE_CONTEST ? "navLink-desktop--active" : "navLink-desktop--inactive"
                }`}
              >
                Create contest
              </a>
            </Link>
            <Link href={ROUTE_VIEW_CONTESTS}>
              <a
                className={`navLink-desktop ${
                  [ROUTE_VIEW_CONTEST, ROUTE_VIEW_CONTESTS, ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTEST_RULES].includes(
                    pathname,
                  )
                    ? "navLink-desktop--active"
                    : "navLink-desktop--inactive"
                }`}
              >
                View contests
              </a>
            </Link>
          </nav>
          <div className="xs:hidden">
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button
                    className={`${
                      open ? "border-neutral-5" : "border-neutral-3"
                    } z-10 py-2 pis-3 pie-4 flex items-center font-bold text-2xs fixed max-w-screen-min w-max-content border bg-primary-0 rounded-full  border-solid bg-neutral-0 bottom-3 left-1/2 -translate-x-1/2`}
                  >
                    {open ? (
                      <XIcon className="w-5 mie-1ex text-neutral-9" />
                    ) : (
                      <MenuIcon className="text-neutral-9 w-5 mie-1ex" />
                    )}{" "}
                    Menu
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="text-2xs px-3 divide-y divide-solid divide-neutral-4 fixed w-full bottom-8 left-1/2 -translate-x-1/2 ">
                      <div className="pb-5 pt-2.5 flex flex-col border bg-primary-0 rounded-lg border-neutral-3 border-solid bg-neutral-1">
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink active={active} href="/">
                              Home
                            </MenuLink>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink active={active} href={ROUTE_CREATE_CONTEST}>
                              Create contest
                            </MenuLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <MenuLink active={active} href={ROUTE_VIEW_CONTESTS}>
                              View contests
                            </MenuLink>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>

          <div className="text-sm mis-auto">
            <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
          </div>
        </div>
      </header>
      <main className="flex flex-col grow">{children}</main>
      <footer className="mt-auto py-20 xs:pb-0">
        <div className="text-true-white text-opacity-80 font-medium container justify-center items-start text-2xs flex flex-col space-y-1 xs:space-y-0 xs:space-i-4 xs:flex-row mx-auto">
          {FOOTER_LINKS.map((link, key) => (
            <a
              className="py-2 xs:px-2"
              key={`footer-link-${key}`}
              href={link.href}
              rel="nofollow noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="py-4 text-2xs">
          <div className="mx-auto container">
            <a
              className="items-center flex xs:justify-center"
              target="_blank"
              rel="nofollow noreferrer"
              href="https://vercel.com/?utm_source=jokedao&utm_campaign=oss"
            >
              <span className="sr-only">Powered by Vercel</span>
              <span className="pie-1ex">Powered by</span>
              <IconPoweredByVercel aria-hidden="true" className="w-20" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export const getLayout = (page: any) => <LayoutBase>{page}</LayoutBase>;

export default LayoutBase;
