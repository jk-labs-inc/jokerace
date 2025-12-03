import { ConnectButtonCustom } from "@components/Connect";
import CustomLink from "@components/UI/Link";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { PageAction } from "@hooks/useCreateFlowAction/store";
import { useNavigate } from "@tanstack/react-router";
import { FC, useEffect, useState } from "react";

interface CreateFlowHeaderDesktopLayoutProps {
  address: string;
  isLoading: boolean;
  isSuccess: boolean;
  pageAction: PageAction;
}

const CreateFlowHeaderDesktopLayout: FC<CreateFlowHeaderDesktopLayoutProps> = ({
  address,
  isLoading,
  isSuccess,
  pageAction,
}) => {
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavigation = (action: "play" | "create") => {
    if (action === "play") {
      navigate({ to: ROUTE_VIEW_LIVE_CONTESTS });
    } else {
      navigate({ to: ROUTE_CREATE_CONTEST });
    }
  };

  return (
    <header className="flex flex-row items-center justify-between pl-[120px] pr-[60px] mt-8">
      <CustomLink to="/">
        <h1 className="font-sabo-filled text-neutral-11 normal-case text-[40px]">
          J<span className="text-[30px]">oke</span>R<span className="text-[30px]">ace</span>
        </h1>
      </CustomLink>

      {!isLoading && !isSuccess && (
        <div className="flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-neutral-10 shadow-create-header">
          <p
            className={`cursor-pointer ${pageAction === "play" ? "text-neutral-11" : "text-neutral-10"}`}
            onClick={() => handleNavigation("play")}
          >
            play
          </p>
          <p
            className={`cursor-pointer ${pageAction === "create" ? "text-neutral-11" : "text-neutral-10"}`}
            onClick={() => handleNavigation("create")}
          >
            create
          </p>
        </div>
      )}

      {!isLoading && !isSuccess && <ConnectButtonCustom />}
    </header>
  );
};

export default CreateFlowHeaderDesktopLayout;
