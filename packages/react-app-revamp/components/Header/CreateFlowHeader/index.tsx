import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { MediaQuery } from "@helpers/mediaQuery";
import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useWindowSize } from "react-use";
import { useAccount } from "wagmi";
import CreateFlowHeaderDesktopLayout from "./DesktopLayout";
import CreateFlowHeaderMobileLayout from "./MobileLayout";

const CreateFlowHeader = () => {
  const { isConnected, address } = useAccount();
  const { step, isLoading, isSuccess } = useDeployContestStore(state => state);
  const { pageAction, setPageAction } = usePageActionStore(state => state);
  const onPreviousStep = usePreviousStep();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { width: confettiWidth, height: confettiHeight } = useWindowSize();

  useEffect(() => {
    return () => {
      setPageAction("create");
    };
  }, [setPageAction]);

  return (
    <div>
      <MediaQuery maxWidth={1024}>
        <CreateFlowHeaderMobileLayout
          address={address ?? ""}
          isConnected={isConnected}
          pageAction={pageAction}
          step={step}
          setPageAction={setPageAction}
          openConnectModal={openConnectModal}
          openAccountModal={openAccountModal}
          onPreviousStep={onPreviousStep}
        />
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <CreateFlowHeaderDesktopLayout
          address={address ?? ""}
          isLoading={isLoading}
          isSuccess={isSuccess}
          pageAction={pageAction}
          confettiWidth={confettiWidth}
          confettiHeight={confettiHeight}
          setPageAction={setPageAction}
        />
      </MediaQuery>
    </div>
  );
};

export default CreateFlowHeader;
