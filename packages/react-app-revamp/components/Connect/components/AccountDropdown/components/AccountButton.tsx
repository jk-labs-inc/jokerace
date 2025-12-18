import { MenuButton } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface AccountButtonProps {
  ensAvatar: string | null | undefined;
  ensName: string | null | undefined;
  displayName: string;
}

const AccountButton: FC<AccountButtonProps> = ({ ensAvatar, ensName, displayName }) => {
  return (
    <MenuButton
      className={`w-auto flex items-center gap-4 justify-between rounded-2xl bg-primary-1 p-4 h-10 text-[16px] text-neutral-11 font-bold focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white border border-transparent hover:border-neutral-17 transition-all duration-200 ease-in-out`}
    >
      {({ open }) => (
        <>
          {ensAvatar && (
            <img
              src={ensAvatar as string}
              alt={ensName || displayName}
              width={20}
              height={20}
              className="rounded-full mt-1"
            />
          )}
          {ensName || displayName}
          <ChevronDownIcon
            className={`text-neutral-11 w-6 h-5 mt-1 transition-transform duration-200 ease-out ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </>
      )}
    </MenuButton>
  );
};

export default AccountButton;
