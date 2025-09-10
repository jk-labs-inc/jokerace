import InfoPanel from "../../InfoPanel";

const RewardsNotStarted = () => {
  const description = (
    <p className="text-[16px] text-neutral-11">
      {" "}
      come back when voting opens to qualify <br />
      for rewards.
    </p>
  );

  return (
    <InfoPanel
      title="my rewards"
      image="/rewards/voters-voting-not-started.png"
      imageAlt="voting not started"
      heading="get ready!"
      description={description}
    />
  );
};

export default RewardsNotStarted;
