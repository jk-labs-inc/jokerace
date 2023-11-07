import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import BurgerMenu from "@components/UI/BurgerMenu";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import EthereumAddress from "@components/UI/EtheuremAddress";
import { FOOTER_LINKS } from "@config/links";
import { ROUTE_VIEW_USER } from "@config/routes";
import { PageAction } from "@hooks/useCreateFlowAction/store";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface CreateFlowHeaderMobileLayoutProps {
  address: string;
  isConnected: boolean;
  pageAction: PageAction;
  step: number;
  setPageAction?: (pageAction: PageAction) => void;
  openConnectModal?: () => void;
  openAccountModal?: () => void;
  onPreviousStep?: () => void;
}

const CreateFlowHeaderMobileLayout: FC<CreateFlowHeaderMobileLayoutProps> = ({
  address,
  isConnected,
  pageAction,
  step,
  setPageAction,
  openConnectModal,
  openAccountModal,
  onPreviousStep,
}) => {
  const allowedLinks = ["Github", "Mirror", "Twitter", "Telegram", "Report a bug", "Terms"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  return (
    <>
      <header className={`flex flex-row items-center justify-between px-[30px] mt-4`}>
        {pageAction === "create" && step > 0 && (
          <div onClick={onPreviousStep}>
            <Image src="/create-flow/back_mobile.svg" className="mt-[5px]" width={30} height={30} alt="back" />
          </div>
        )}

        <div
          onClick={isConnected ? openAccountModal : openConnectModal}
          className="md:hidden transition-all duration-500"
        >
          {isConnected ? (
            <div className="flex gap-2 items-center">
              {address && (
                <>
                  <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
                    <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
                  </Link>
                  <ConnectButtonCustom displayOptions={{ onlyChainSwitcher: true, showChainName: false }} />
                </>
              )}
            </div>
          ) : null}
        </div>
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
      </header>
      <MainHeaderMobileLayout
        isConnected={isConnected}
        address={address}
        openAccountModal={openAccountModal}
        openConnectModal={openConnectModal}
      />
    </>
  );
};

export default CreateFlowHeaderMobileLayout;
