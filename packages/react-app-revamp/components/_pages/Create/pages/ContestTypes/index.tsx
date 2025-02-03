import CreateContestTypesAnyoneCanPlay from "./components/Types/AnyoneCanPlay";
import CreateContestTypesEntryBased from "./components/Types/EntryBased";
import CreateContestTypesVotingBased from "./components/Types/VotingBased";

const CreateContestTypes = () => {
  return (
    <div className="flex flex-col gap-6 lg:ml-[300px] mt-6 md:mt-24 animate-reveal">
      <CreateContestTypesAnyoneCanPlay />
      <CreateContestTypesEntryBased />
      <CreateContestTypesVotingBased />
    </div>
  );
};

export default CreateContestTypes;
