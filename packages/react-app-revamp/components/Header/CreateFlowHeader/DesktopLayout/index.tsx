import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_USER } from "@config/routes";
import { PageAction } from "@hooks/useCreateFlowAction/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

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
  const router = useRouter();

  const handleNavigation = (action: "play" | "create") => {
    if (action === "play") {
      router.push(ROUTE_VIEW_LIVE_CONTESTS);
    } else {
      router.push(ROUTE_CREATE_CONTEST);
    }
  };

  return (
    <header className="flex flex-row items-center justify-between pl-[120px] pr-[60px] mt-8">
      <Link href="/">
        <h1 className="font-sabo text-neutral-11 normal-case text-[40px]">
          J<span className="text-[30px]">oke</span>R<span className="text-[30px]">ace</span>
        </h1>
      </Link>

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

      {!isLoading && !isSuccess && (
        <div className="flex items-center gap-3">
          {address && <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion />}
          <ConnectButtonCustom />
        </div>
      )}
    </header>
  );
};

export default CreateFlowHeaderDesktopLayout;
