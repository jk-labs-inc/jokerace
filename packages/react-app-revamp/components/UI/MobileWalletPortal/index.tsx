import {
  ROUTE_VIEW_USER,
  ROUTE_VIEW_USER_COMMENTS,
  ROUTE_VIEW_USER_SUBMISSIONS,
  ROUTE_VIEW_USER_VOTING,
} from "@config/routes";
import { ChevronRightIcon, PowerIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import CustomLink from "../Link";
import UserProfileDisplay from "../UserProfileDisplay";
import SendFunds from "@components/SendFunds";
import Drawer from "../Drawer";

interface MobileProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  onDisconnect: () => void;
}

const navLinks = [
  {
    href: ROUTE_VIEW_USER,
    label: "Contests",
  },
  {
    href: ROUTE_VIEW_USER_SUBMISSIONS,
    label: "Entries",
  },
  {
    href: ROUTE_VIEW_USER_VOTING,
    label: "Votes",
  },
  {
    href: ROUTE_VIEW_USER_COMMENTS,
    label: "Comments",
  },
];

export const MobileProfileDrawer: React.FC<MobileProfileDrawerProps> = ({ isOpen, onClose, address, onDisconnect }) => {
  const [isSendFundsModalOpen, setIsSendFundsModalOpen] = useState(false);

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} className="bg-true-black w-full h-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 px-8 pt-4">
            <UserProfileDisplay
              size="medium"
              ethereumAddress={address}
              shortenOnFallback
              includeSocials
              includeSendFunds
              onSendFundsClick={() => setIsSendFundsModalOpen(true)}
            />
            <div className="flex flex-col gap-2 border-t border-primary-2 px-4 pt-6">
              {navLinks.map(link => (
                <CustomLink
                  key={link.href}
                  href={link.href.replace("[address]", address)}
                  className="flex gap-2 items-center text-[16px] font-bold text-neutral-11 uppercase"
                >
                  my {link.label}
                  <ChevronRightIcon width={20} height={20} className="text-neutral-11" />
                </CustomLink>
              ))}
            </div>
          </div>
          <div className="flex border-t border-primary-2 items-center justify-center py-4" onClick={onDisconnect}>
            <PowerIcon width={32} height={32} className="text-negative-11" />
          </div>
        </div>
      </Drawer>
      {isSendFundsModalOpen && (
        <SendFunds
          isOpen={isSendFundsModalOpen}
          onClose={() => setIsSendFundsModalOpen(false)}
          recipientAddress={address}
        />
      )}
    </>
  );
};
