/* eslint-disable @next/next/no-img-element */

const SendProposalMobileLayoutConfirmLoadingContent = () => {
  return (
    <div className="mb-16">
      <div className="text-[16px] text-neutral-11">
        this should just take a few seconds
        <br />
        —here’s a gif while we wait:
      </div>
      <div className="relative w-[260px] h-[157px] border-4 border-true-black rounded-[10px] mt-4 overflow-hidden">
        <div className="absolute top-0 left-0 bg-black py-1 px-2">
          <span className="text-[8px] text-true-white font-sabo font-bold">JOKETV</span>
        </div>
        <img src="/contest/dancing-dance.gif" className="w-full h-full" alt="Loading GIF" />
      </div>
    </div>
  );
};

export default SendProposalMobileLayoutConfirmLoadingContent;
