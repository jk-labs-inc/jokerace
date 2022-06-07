import { forwardRef, Fragment } from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_CONTESTS } from "@config/routes";
import { FOOTER_LINKS } from "@config/links";
import { Menu, Transition } from "@headlessui/react";
import { XIcon, MenuIcon } from "@heroicons/react/solid";

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
      <header className="relative border-b border-neutral-2 border-solid">
        <div className="py-2 container flex items-center mx-auto">
          <Link href="/">
            <a className="text-4xl sm:text-xl">
              🃏 <span className="sr-only">Home</span>
            </a>
          </Link>
          <nav className="hidden sm:flex sm:mis-4 space-i-0.5">
            <Link href={ROUTE_CREATE_CONTEST}>
              <a
                className={`navLink-desktop ${
                  pathname === ROUTE_CREATE_CONTEST ? "navLink-desktop--active" : "navLink-desktop--inactive"
                }`}
              >
                Create contests
              </a>
            </Link>
            <Link href={ROUTE_VIEW_CONTESTS}>
              <a
                className={`navLink-desktop ${
                  pathname === ROUTE_VIEW_CONTESTS ? "navLink-desktop--active" : "navLink-desktop--inactive"
                }`}
              >
                View contests
              </a>
            </Link>
          </nav>
          <div className="sm:hidden">
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
            <ConnectButton showBalance={false} label="Connect wallet" />
          </div>
        </div>
      </header>
      <main className="flex flex-col grow">{children}</main>
      <footer className="mt-auto py-20 sm:pb-0">
        <div className="text-true-white text-opacity-80 font-medium container justify-center items-start text-2xs flex flex-col space-y-1 sm:space-y-0 sm:space-i-4 sm:flex-row mx-auto">
          {FOOTER_LINKS.map((link, key) => (
            <a
              className="py-2 sm:px-2"
              key={`footer-link-${key}`}
              href={link.href}
              rel="nofollow noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
};

export default LayoutBase;
