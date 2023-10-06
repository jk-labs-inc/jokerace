import { Proposal } from "@components/_pages/ProposalContent";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FC } from "react";

interface SubmissionPageMobileLayoutProps {
  proposalId: string;
  prompt: string;
  proposal: Proposal;
  onClose?: () => void;
}

const SubmissionPageMobileLayout: FC<SubmissionPageMobileLayoutProps> = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 bg-true-black overflow-y-auto w-screen -ml-6 mt-7 pl-9">
      <div className="flex justify-between pr-9">
        <ArrowLeftIcon width={24} />
        <div className="flex gap-2 self-end">
          <div className={`flex items-center  bg-neutral-12 rounded-full overflow-hidden w-8 h-8`}>
            <Image
              width={32}
              height={32}
              className="object-cover grayscale"
              src="/socials/lens-leaf.svg"
              alt="avatar"
            />
          </div>
          <div className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}>
            <Image
              width={28}
              height={28}
              className="object-cover m-auto"
              src="/socials/twitter-light.svg"
              alt="avatar"
            />
          </div>
          <div
            className={`flex items-center  bg-true-black rounded-full border-neutral-11 border overflow-hidden w-8 h-8`}
          >
            <Image src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageMobileLayout;
