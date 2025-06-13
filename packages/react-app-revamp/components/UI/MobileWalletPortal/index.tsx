import {
  ROUTE_VIEW_USER,
  ROUTE_VIEW_USER_COMMENTS,
  ROUTE_VIEW_USER_SUBMISSIONS,
  ROUTE_VIEW_USER_VOTING,
} from "@config/routes";
import { ChevronRightIcon, PowerIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import CustomLink from "../Link";
import UserProfileDisplay from "../UserProfileDisplay";
import SendFunds from "@components/SendFunds";

interface MobileProfilePortalProps {
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

export const MobileProfilePortal: React.FC<MobileProfilePortalProps> = ({ isOpen, onClose, address, onDisconnect }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isSendFundsModalOpen, setIsSendFundsModalOpen] = useState(false);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50  ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-neutral-8/40  pointer-events-none" />
      <div
        className={`absolute animate-appear inset-x-0 bottom-0 bg-true-black
        border-t border-neutral-9 rounded-t-[40px] ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 px-8 pt-8">
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
      </div>
      {isSendFundsModalOpen && (
        <SendFunds
          isOpen={isSendFundsModalOpen}
          onClose={() => setIsSendFundsModalOpen(false)}
          recipientAddress={address}
        />
      )}
    </div>,
    document.body,
  );
};
