import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { Dialog } from "@headlessui/react";
import { useChainModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { useMedia } from "react-use";

interface EthereumDeploymentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDeploy?: () => void;
}

const EthereumDeploymentModal: FC<EthereumDeploymentModalProps> = ({ isOpen, setIsOpen, onDeploy }) => {
  const { openChainModal } = useChainModal();

  const onChangeChainHandler = () => {
    setIsOpen(false);
    openChainModal?.();
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-neutral-8 bg-opacity-60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
            className={`text-sm mx-auto min-h-screen max-h-screen w-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] md:w-[800px] bg-true-black 2xs:rounded-[10px]`}
          >
            <div className="px-12 py-12 md:pl-24 md:pr-14 md:py-16">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                  <p className="text-[24px] text-neutral-11 font-bold">🚨 ethereum mainnet alert 🚨 </p>
                  <p className="text-[20px] text-neutral-11">it looks like you’re deploying to ethereum mainnet 😰</p>
                  <p className="text-[20px] text-neutral-11">
                    mainnet fees can cost <b></b>~100x as much as fees on other <br /> chains. so players could end up
                    paying tens or hundreds of <br />
                    dollars to participate in your contest.
                  </p>
                  <p className="text-[20px] text-neutral-11">
                    would you like to cancel so you can change chains in your <br /> wallet (on the upper right)?
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-40 items-center">
                  <ButtonV3
                    colorClass={`bg-gradient-create text-[16px] rounded-[10px] font-bold  text-true-black`}
                    size={ButtonSize.DEFAULT_LONG}
                    onClick={onChangeChainHandler}
                  >
                    i’ll change chains
                  </ButtonV3>
                  <p className="text-[16px] text-neutral-11 cursor-pointer" onClick={onDeploy}>
                    let me use mainnet
                  </p>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default EthereumDeploymentModal;
