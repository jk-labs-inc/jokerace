import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { formatUnits } from "ethers/lib/utils";
import { createMerkleTreeFromVotes } from "lib/merkletree/generateVotersTree";
import { useEffect, useState } from "react";
import CSVEditorVoting, { VotingFieldObject } from "./components/CSVEditor";

const CreateVotingAllowlist = () => {
  const { step, setVotingMerkle, votingMerkle, setStep } = useDeployContestStore(state => state);
  const [allowList, setAllowList] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!votingMerkle || !votingMerkle.merkleTree || votingMerkle.merkleTree.getLeaves.length === 0) return;

    const newAllowList = votingMerkle.recipients.reduce((acc, field) => {
      // Convert back to 'normal' number from string that represents a BigNumber
      let numVotes = formatUnits(field.numVotes, 18);

      acc[field.address] = parseFloat(numVotes);
      return acc;
    }, {} as Record<string, number>);

    setAllowList(newAllowList);
  }, [votingMerkle]);

  const handleAllowListChange = (fields: VotingFieldObject[]) => {
    const nonEmptyFields = fields.filter(({ address, votes }) => address || votes);
    const newAllowList = nonEmptyFields.reduce((acc, { address, votes }) => ({ ...acc, [address]: Number(votes) }), {});

    nonEmptyFields.some(({ error }) => error !== null) ? setAllowList({}) : setAllowList(newAllowList);
  };

  const handleNextStep = () => {
    if (Object.keys(allowList).length === 0) return;

    setVotingMerkle(createMerkleTreeFromVotes(18, allowList));
    setStep(step + 1);
  };

  return (
    <div className="mt-5 ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[24px] font-bold text-primary-10">who can vote?</p>
        <p className="text-[16px] text-neutral-11">
          copy-paste allowlist into preview box (up to 100 line items) or upload a csv below <br />
          (no limit on line items).
        </p>
      </div>
      <CSVEditorVoting onChange={handleAllowListChange} />
      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </div>
  );
};

export default CreateVotingAllowlist;
