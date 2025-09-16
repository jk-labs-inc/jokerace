import ContestParametersVotingPrice from "../../../VotingPrice";

const ContestParametersVotingCurrent = () => {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">voting</p>
      <ul className="pl-4 text-[16px] text-neutral-9">
        <>
          <li className="list-disc">anyone can vote</li>
          <ContestParametersVotingPrice />
        </>
      </ul>
    </div>
  );
};

export default ContestParametersVotingCurrent;
