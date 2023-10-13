import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import Image from "next/image";
import { FC, useState } from "react";

interface SendProposalMobileLayoutConfirmSuccessContentProps {
  proposalId: string;
}

const SendProposalMobileLayoutConfirmSuccessContent: FC<SendProposalMobileLayoutConfirmSuccessContentProps> = ({
  proposalId,
}) => {
  const [copyText, setCopyText] = useState("copy");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://jokerace.xyz...${proposalId}`);
      setCopyText("copied!");
      setTimeout(() => setCopyText("copy"), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  return (
    <>
      <p className="text-[20px] text-neutral-11 font-bold">share it:</p>
      <div className="flex gap-4">
        <Image src="/socials/share-submission/lens.svg" width={32} height={32} alt="lens" />
        <Image src="/socials/share-submission/twitter.svg" width={32} height={32} alt="lens" />
        <Image src="/socials/share-submission/instagram.svg" width={32} height={32} alt="lens" />
        <Image src="/socials/share-submission/linkedin.svg" width={32} height={32} alt="lens" />
        <Image src="/socials/share-submission/facebook.svg" width={32} height={32} alt="lens" />
      </div>
      <p className="text-[20px] text-neutral-11 font-bold">copy it:</p>
      <div
        className="flex items-center justify-between px-4 w-full border-neutral-10 border h-8 rounded-[40px]"
        onClick={handleCopy}
      >
        <p className="text-[16px] text-neutral-11 font-bold">https://jokerace.xyz...{proposalId.slice(0, 8)}</p>
        <p className="text-positive-11 font-bold text-[16px]">{copyText}</p>
      </div>
      <ButtonV3 colorClass="bg-gradient-share-submission rounded-[40px] mt-8" size={ButtonSize.FULL}>
        let’s see it
      </ButtonV3>
    </>
  );
};

export default SendProposalMobileLayoutConfirmSuccessContent;
