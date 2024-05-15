import BurgerMenu from "@components/UI/BurgerMenu";
import { IconTrophy } from "@components/UI/Icons";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { FOOTER_LINKS } from "@config/links";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
} from "@config/routes";
import { HomeIcon, PencilAltIcon, SearchIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface MainHeaderMobileLayoutProps {
  isConnected: boolean;
  address: string;
  showProfile?: boolean;
  openConnectModal?: () => void;
  openAccountModal?: () => void;
}

const MainHeaderMobileLayout: FC<MainHeaderMobileLayoutProps> = ({
  isConnected,
  showProfile,
  address,
  openConnectModal,
  openAccountModal,
}) => {
  const pathname = usePathname();
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const displayProfile = showProfile && !pathname?.includes("user");
  const isActive = (route: string) => (pathname === route ? "text-primary-10 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(pathname ?? "") ? "text-primary-10 transition-colors font-bold" : "";
  const allowedLinks = ["Github", "Twitter", "Telegram", "Report a bug", "Terms"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));

  return (
    <>
      <div className="flex justify-between items-center px-4 mt-4">
        {address && displayProfile ? (
          <div className="top-0 right-0 left-0 ">
            <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion />
          </div>
        ) : null}

        {displayProfile ? (
          <BurgerMenu>
            <div className="flex flex-col gap-2">
              {filteredLinks.map((link, key) => (
                <a
                  className="font-sabo text-neutral-11 text-[24px] py-2 xs:px-2"
                  key={`footer-link-${key}`}
                  href={link.href}
                  rel="nofollow noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </BurgerMenu>
        ) : null}
      </div>

      <header
        className={`flex flex-row bottom-0 right-0 left-0 fixed items-center justify-between border-t-neutral-2 border-t-2 pt-2 ${
          isInPwaMode ? "pb-8" : "pb-2"
        } px-8 mt-4 bg-true-black z-50`}
      >
        <Link href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
          <HomeIcon width={26} />
          <p className="text-[12px]">home</p>
        </Link>

        <Link href={ROUTE_VIEW_CONTESTS} className={`flex flex-col ${isActive(ROUTE_VIEW_CONTESTS)}`}>
          <SearchIcon width={26} />
          <p className="text-[12px]">search</p>
        </Link>

        <Link
          href={ROUTE_VIEW_LIVE_CONTESTS}
          className={`flex flex-col text-neutral-11 ${isOneOfActive([ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_CONTEST])}`}
        >
          <IconTrophy width={26} height={26} />
          <p className="text-[12px] text-center">play</p>
        </Link>

        <Link href={ROUTE_CREATE_CONTEST} className={`flex flex-col items-center ${isActive(ROUTE_CREATE_CONTEST)}`}>
          <PencilAltIcon width={26} />
          <p className="text-[12px]">create</p>
        </Link>

        <div onClick={isConnected ? openAccountModal : openConnectModal} className="transition-all duration-500">
          {isConnected ? (
            <div className="flex flex-col items-center">
              <Image width={26} height={26} src="/header/wallet-connected.svg" alt="wallet-connected" />
              <p className="text-[12px]">wallet</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Image width={26} height={26} src="/header/wallet.svg" alt="wallet" />
              <p className="text-[12px]">wallet</p>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default MainHeaderMobileLayout;
