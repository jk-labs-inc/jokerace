import CreateDate from "../../components/DatePicker";
import Description from "../../components/Description";
import CreateEndContestDate from "./components/EndDate";
import CreateSubmissionsOpenDate from "./components/SubmissionDate";
import CreateVotesOpenDate from "./components/VotesDate";

const CreateContestTiming = () => {
  return (
    <>
      <Description step={5} title="" />
      <div className="flex flex-col ml-[70px] -mt-[45px] gap-10">
        <CreateSubmissionsOpenDate />
        <CreateVotesOpenDate />
        <CreateEndContestDate />
      </div>
    </>
  );
};

export default CreateContestTiming;
