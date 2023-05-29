import MenuLink from "@components/UI/Menu/Link";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_CONTESTS } from "@config/routes";
import { Menu, Transition } from "@headlessui/react";
import { XIcon, MenuIcon } from "@heroicons/react/outline";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Fragment } from "react";

const CreateFlowHeader = () => {
  const { setPageAction, pageAction } = useDeployContestStore(state => state);

  return (
    <header className="flex flex-col lg:flex-row gap-3 lg:gap-0 items-center lg:justify-between lg:pl-[80px] lg:pr-[60px] mt-8">
      <Link href="/">
        <h1 className="font-sabo text-primary-10 text-[55px] lg:text-[40px]">JOKERACE</h1>
      </Link>

      <div className="hidden md:flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 drop-shadow-2xl">
        <p
          onClick={() => setPageAction("play")}
          className={`cursor-pointer ${pageAction === "play" ? "text-primary-10" : "text-neutral-11"}`}
        >
          play
        </p>
        <p
          onClick={() => setPageAction("create")}
          className={`cursor-pointer ${pageAction === "create" ? "text-primary-10" : "text-neutral-11"}`}
        >
          create
        </p>
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

      <div className="flex">
        <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
      </div>
    </header>
  );
};

export default CreateFlowHeader;
