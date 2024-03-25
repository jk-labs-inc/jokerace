import { useChainModal } from "@rainbow-me/rainbowkit";
/* eslint-disable react/no-unescaped-entities */

const CreateContestChargeUnsupportedChain = () => {
  const { openChainModal } = useChainModal();

  const docsUrl = `https://docs.jokerace.io/faq#which-chains-does-jokerace-currently-support-monetization-on`;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] md:text-[20px] text-neutral-11">
        unfortunately monetization isn’t currently available for this chain.
        <br />
        normally we split all fees with you so you can make money from running contests. but we don't have a way to
        collect fees on this chain.
      </p>
      <p className="text-[20px] md:text-[20px] text-neutral-11">
        we recommend{" "}
        <span
          onClick={openChainModal}
          className="text-positive-11 font-bold cursor-pointer hover:text-positive-9 transition-colors"
        >
          {" "}
          switching chains{" "}
        </span>
        (see supported chains{" "}
        <a
          href={docsUrl}
          target="blank"
          className="text-positive-11 font-bold cursor-pointer hover:text-positive-9 transition-colors"
        >
          here
        </a>{" "}
        ), or you can proceed without any way to make money.
      </p>
    </div>
  );
};

export default CreateContestChargeUnsupportedChain;
