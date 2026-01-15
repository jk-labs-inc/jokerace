import { useModal } from "@getpara/react-sdk-lite";
import { MediaQuery } from "@helpers/mediaQuery";
import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useWallet } from "@hooks/useWallet";
import { useEffect } from "react";
import MainHeaderMobileLayout from "../MainHeader/MobileLayout";
import CreateFlowHeaderDesktopLayout from "./DesktopLayout";

const CreateFlowHeader = () => {
  const { isConnected, userAddress } = useWallet();
  const { isLoading, isSuccess } = useDeployContestStore(state => state);
  const { pageAction, setPageAction } = usePageActionStore(state => state);
  const { openModal } = useModal();

  useEffect(() => {
    return () => {
      setPageAction("create");
    };
  }, [setPageAction]);

  return (
    <div>
      <MediaQuery maxWidth={1024}>
        <MainHeaderMobileLayout
          isConnected={isConnected}
          address={userAddress ?? ""}
          openConnectModal={() => openModal()}
        />
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <CreateFlowHeaderDesktopLayout
          address={userAddress ?? ""}
          isLoading={isLoading}
          isSuccess={isSuccess}
          pageAction={pageAction}
        />
      </MediaQuery>
    </div>
  );
};

export default CreateFlowHeader;
