const CreateContestChargeUnsupportedChain = () => {
  const docsUrl = `https://docs.jokerace.io/faq#which-chains-does-jokerace-currently-support-monetization-on`;
  return (
    <div className="flex flex-col gap-4 ">
      <p className="text-[20px] md:text-[20px] text-neutral-11">
        unfortunately monetization isn’t currently available for this chain—so there’s no way for you <br />
        to make money from this contest. <br />
        if you’d like to enable monetization, please{" "}
        <a
          href={docsUrl}
          target="blank"
          className="text-positive-11 font-bold cursor-pointer hover:text-positive-9 transition-colors"
        >
          switch to a chain
        </a>{" "}
        that supports it now.
      </p>
    </div>
  );
};

export default CreateContestChargeUnsupportedChain;
