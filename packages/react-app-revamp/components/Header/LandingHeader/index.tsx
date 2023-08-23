import Button from "@components/UI/Button";
import EthereumAddress from "@components/UI/EtheuremAddress";
import MenuLink from "@components/UI/Menu/Link";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_CONTESTS, ROUTE_VIEW_CREATOR } from "@config/routes";
import { Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const LandingHeader = () => {
  const { isConnected, address } = useAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="flex items-center flex-col lg:flex-row gap-5 lg:gap-20 lg:pl-8 lg:pr-8 max-w-[1350px] 3xl:pl-16">
      <Link href="/">
        <div>
          <h1 className="font-sabo text-primary-10 text-[55px] md:text-[80px]">JOKERACE</h1>
          <p className="text-primary-10 text-700 text-center lg:text-left lg:pl-9 3xl:pl-12 font-bold mt-[-10px] text-[20px] md:text-[20px]">
            noun. US /dʒoʊ·​kreɪs/
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-5 text-[18px]">
        <p className="text-[18px] md:text-[20px] lg:hidden font-bold">
          contests for communities to make, <br />
          execute, and reward decisions
        </p>
        <Link href={ROUTE_CREATE_CONTEST}>
          <Button className="hidden lg:flex h-10" intent={`${isConnected ? "primary" : "neutral-outline"}`}>
            Create contest
          </Button>
        </Link>
        <div className="hidden lg:flex items-center gap-3">
          <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
          {isClient && address && (
            <Link href={`${ROUTE_VIEW_CREATOR}/${address}`}>
              <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="xs:hidden z-10">
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
                    {isClient && address && (
                      <Menu.Item>
                        {({ active }) => (
                          <MenuLink active={active} href={`${ROUTE_VIEW_CREATOR}/${address}`}>
                            Profile
                          </MenuLink>
                        )}
                      </Menu.Item>
                    )}

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
    </header>
  );
};

export default LandingHeader;
