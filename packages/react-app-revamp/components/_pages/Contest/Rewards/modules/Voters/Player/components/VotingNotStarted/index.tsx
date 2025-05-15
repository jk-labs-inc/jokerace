import InfoPanel from "../../../../shared/InfoPanel";

const VoterRewardsPagePlayerViewVotingNotStarted = () => {
  return (
    <InfoPanel
      title="my rewards"
      image="/rewards/voters-voting-not-started.png"
      imageAlt="voting not started"
      heading="get ready!"
      description={
        <p className="text-[16px] text-neutral-11">
          come back when voting opens to qualify <br />
          for rewards.
        </p>
      }
    />
  );
};

export default VoterRewardsPagePlayerViewVotingNotStarted;
