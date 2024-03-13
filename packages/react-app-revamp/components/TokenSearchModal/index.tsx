import { Dialog } from "@headlessui/react";
import { NFTMetadata } from "@hooks/useSearchNfts";
import { FilteredToken } from "@hooks/useTokenList";
import Image from "next/image";
import { FC, useCallback } from "react";
import TokenSearchModalERC20 from "./ERC20";
import TokenSearchModalNft from "./NFT";
import { Option } from "./components/ChainDropdown";

export enum TokenSearchModalType {
  ERC20 = "erc20",
  NFT = "nft",
  ERC721 = "ERC721",
}

interface TokenSearchModalProps {
  type: TokenSearchModalType;
  chains: Option[];
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onSelectToken?: (token: FilteredToken) => void;
  onSelectNft?: (nft: NFTMetadata) => void;
  onSelectChain?: (chain: string) => void;
}

const TokenSearchModal: FC<TokenSearchModalProps> = ({
  type,
  isOpen,
  setIsOpen,
  chains,
  onSelectToken,
  onClose,
  onSelectNft,
  onSelectChain,
}) => {
  const tokenSearchModalTitle = type === TokenSearchModalType.ERC20 ? "select a token" : "select an NFT";

  const handleClose = useCallback(() => {
    setIsOpen?.(false);
    onClose?.();
  }, [onClose, setIsOpen]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-true-black bg-opacity-80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
            className={`text-sm shadow-file-upload mx-auto min-h-screen max-h-screen w-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] md:h-[658px] md:max-h-[658px] md:w-[552px] bg-true-black 2xs:rounded-[15px]`}
          >
            <div className="px-4 md:px-8 py-10">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-bold text-true-white normal-case">{tokenSearchModalTitle}</p>
                    <Image
                      src="/modal/modal_close.svg"
                      alt="close"
                      width={30}
                      height={24}
                      onClick={handleClose}
                      className="cursor-pointer hover:scale-[1.1]"
                    />
                  </div>
                  <div className="bg-primary-5 h-[2px]" />
                </div>
                {type === TokenSearchModalType.ERC20 ? (
                  <TokenSearchModalERC20 chains={chains} onSelectToken={onSelectToken} />
                ) : (
                  <TokenSearchModalNft chains={chains} onSelectNft={onSelectNft} onSelectChain={onSelectChain} />
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default TokenSearchModal;
