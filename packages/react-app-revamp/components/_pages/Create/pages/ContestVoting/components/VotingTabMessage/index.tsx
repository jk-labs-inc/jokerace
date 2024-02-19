import { useDeployContestStore } from "@hooks/useDeployContest/store";

const CreateVotingTabMessage = () => {
  const { votingTab } = useDeployContestStore(state => state);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        an allowlist is necessary to prevent bots voting randomly—and to let your <br />
        players know who their judges will be.
      </p>
      {votingTab === 0 ? (
        <p className="text-[20px] text-neutral-11">
          use presets to save time, but remember:{" "}
          <b>
            you can always upload a csv <br /> with any voters (and voting power) you like.
          </b>
        </p>
      ) : null}
    </div>
  );
};

export default CreateVotingTabMessage;
