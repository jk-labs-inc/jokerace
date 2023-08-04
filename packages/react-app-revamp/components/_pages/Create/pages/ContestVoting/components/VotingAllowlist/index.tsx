/* eslint-disable react-hooks/exhaustive-deps */
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";
import { useEffect } from "react";
import CSVEditorVoting, { VotingFieldObject } from "./components/CSVEditor";

const CreateVotingAllowlist = () => {
  const { step, setVotingMerkle, votingMerkle, setError, setVotingAllowlist, votingAllowlist } = useDeployContestStore(
    state => state,
  );
  const votingValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => votingValidation?.[0].validation(votingAllowlist)]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  const handleAllowListChange = (fields: VotingFieldObject[]) => {
    let newAllowList: Record<string, number> = {};
    let errorExists = false;

    for (const field of fields) {
      if (field.address || field.votes) {
        newAllowList[field.address] = Number(field.votes);
        if (field.error !== null) {
          errorExists = true;
          break;
        }
      }
    }

    setVotingAllowlist(errorExists ? {} : newAllowList);
  };

  const handleNextStep = () => {
    if (Object.keys(votingAllowlist).length === 0) return;

    if (votingMerkle) {
      onNextStep();
      return;
    }

    const { merkleRoot, recipients } = generateMerkleTree(18, votingAllowlist);

    setVotingMerkle({ merkleRoot, voters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
  };

  return (
    <div className="mt-5 lg:ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can vote?</p>
        <p className="text-[16px] text-neutral-11">
          copy-paste allowlist into preview box (up to 100 line items) or upload a csv below <br />
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
