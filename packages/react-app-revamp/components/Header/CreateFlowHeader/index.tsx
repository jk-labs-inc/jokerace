import { MediaQuery } from "@helpers/mediaQuery";
import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import CreateFlowHeaderDesktopLayout from "./DesktopLayout";
import CreateFlowHeaderMobileLayout from "./MobileLayout";

const CreateFlowHeader = () => {
  const { isConnected, address } = useAccount();
  const { step, isLoading, isSuccess } = useDeployContestStore(
    useShallow(state => ({
      step: state.step,
      isLoading: state.isLoading,
      isSuccess: state.isSuccess,
    })),
  );
  const { pageAction, setPageAction } = usePageActionStore(
    useShallow(state => ({
      pageAction: state.pageAction,
      setPageAction: state.setPageAction,
    })),
  );
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

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
        />
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <CreateFlowHeaderDesktopLayout
          address={address ?? ""}
          isLoading={isLoading}
          isSuccess={isSuccess}
          pageAction={pageAction}
        />
      </MediaQuery>
    </div>
  );
};

export default CreateFlowHeader;
