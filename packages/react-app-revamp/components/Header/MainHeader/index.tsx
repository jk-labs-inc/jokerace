// src/components/CustomHeader.tsx
import React, { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import {
  ROUTE_CONTEST_PROPOSAL,
  ROUTE_CREATE_CONTEST,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_CONTEST_RULES,
} from "@config/routes";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import MenuLink from "@components/UI/Menu/Link";

const MainHeader: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <header className="relative z-20 border-b border-neutral-2 border-solid">
      <div className="py-2 container flex items-center mx-auto">
        <Link href="/" className="text-4xl xs:text-xl">
          🃏 <span className="sr-only">Home</span>
        </Link>
        <nav className="hidden xs:flex xs:mis-4 space-i-0.5">
          <Link
            href={ROUTE_CREATE_CONTEST}
            className={`navLink-desktop ${
              pathname === ROUTE_CREATE_CONTEST ? "navLink-desktop--active" : "navLink-desktop--inactive"
            }`}
          >
            Create contest
          </Link>
          <Link
            href={ROUTE_VIEW_CONTESTS}
            className={`navLink-desktop ${
              [ROUTE_VIEW_CONTEST, ROUTE_VIEW_CONTESTS, ROUTE_CONTEST_PROPOSAL, ROUTE_VIEW_CONTEST_RULES].includes(
                pathname,
              )
                ? "navLink-desktop--active"
                : "navLink-desktop--inactive"
            }`}
          >
            View contests
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

        <div className="text-sm mis-auto text-[18px] font-bold">
          <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
