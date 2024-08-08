import { Option } from "@components/_pages/Create/components/DefaultDropdown";
import ButtonV3 from "@components/UI/ButtonV3";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Recipient, ValidationError, useCreateRewardsStore } from "../../../../store";
import CreateRewardsPoolRecipientsDropdown from "../Dropdown";

const RANK_LIMIT = 50;

const generateRankOptions = (limit: number): Option[] => {
  return Array.from({ length: limit }, (_, i) => {
    const rank = i + 1;
    return {
      value: rank.toString(),
      label: rank.toString(),
    };
  });
};

const CreateRewardsPoolRecipients: React.FC = () => {
  const [recipientsExceedLimit, setRecipientsExceedLimit] = useState("");
  const [nextId, setNextId] = useState(1);
  const { setRewardPoolData, rewardPoolData } = useCreateRewardsStore(state => state);
  const rankOptions = generateRankOptions(RANK_LIMIT);

  const validateRecipients = (recipients: Recipient[]) => {
    const totalProportion = recipients.reduce(
      (sum, recipient) => sum + (isNaN(recipient.proportion) ? 0 : recipient.proportion),
      0,
    );

    const error: ValidationError = {};

    if (totalProportion !== 100) {
      error.invalidTotal = `Total percentage should be exactly 100%, currently it's ${totalProportion}%`;
    }

    const uniqueRanks = [...new Set(recipients.map(recipient => recipient.place))];
    if (uniqueRanks.length < recipients.length) {
      error.duplicateRank = "There can't be duplicate ranks";
    }

    const zeroProportionRecipients = recipients.filter(recipient => recipient.proportion === 0);
    if (zeroProportionRecipients.length > 0) {
      error.zeroProportion = "Recipients with 0% proportion are not allowed";
    }

    setRewardPoolData(prevData => ({
      ...prevData,
      recipients,
      rankings: recipients.map(recipient => recipient.place),
      shareAllocations: recipients.map(recipient => recipient.proportion),
      validationError: error,
    }));
  };

  const handleAddRecipient = () => {
    if (rewardPoolData.recipients.length >= RANK_LIMIT) {
      setRecipientsExceedLimit(`Cannot add more than ${RANK_LIMIT} recipients.`);
      return;
    }

    setRecipientsExceedLimit("");
    const nextPlace = rewardPoolData.recipients.length + 1;
    const newRecipients = [...rewardPoolData.recipients, { id: nextId, place: nextPlace, proportion: 0 }];
    setNextId(prevId => prevId + 1);
    validateRecipients(newRecipients);
  };

  const handleRemoveRecipient = (id: number) => {
    if (rewardPoolData.recipients.length > 1) {
      const newRecipients = rewardPoolData.recipients.filter(recipient => recipient.id !== id);
      validateRecipients(newRecipients);
    }
  };

  const handleProportionChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    let { value } = event.target;
    let updatedProportion = parseFloat(value);

    if (updatedProportion > 100) {
      updatedProportion = 100;
    }

    const newRecipients = rewardPoolData.recipients.map(recipient =>
      recipient.id === id ? { ...recipient, proportion: updatedProportion } : recipient,
    );

    validateRecipients(newRecipients);
  };

  const handlePlaceChange = (value: string, id: number) => {
    const newPlace = parseInt(value);

    const newRecipients = rewardPoolData.recipients.map(recipient =>
      recipient.id === id ? { ...recipient, place: newPlace } : recipient,
    );

    validateRecipients(newRecipients);
  };

  const totalProportion = rewardPoolData.recipients.reduce(
    (sum, recipient) => sum + (isNaN(recipient.proportion) ? 0 : recipient.proportion),
    0,
  );
  const proportionError = totalProportion > 100 ? "over" : totalProportion < 100 ? "under" : null;

  const formatProportion = (proportion: number) => {
    return Number.isInteger(proportion) ? proportion : proportion.toFixed(2);
  };

  return (
    <div className="md:w-[370px]">
      <div className="flex justify-start">
        <ButtonV3
          onClick={handleAddRecipient}
          colorClass="bg-primary-2"
          textColorClass="text-neutral-11 rounded-[40px] font-normal"
        >
          + Add winner
        </ButtonV3>
      </div>
      <div className="mt-4 text-[16px]">
        <div className="grid grid-cols-2 justify-between mb-3 text-neutral-10 font-bold">
          <span className="uppercase">winner</span>
          <span className="uppercase text-right">Proportion</span>
        </div>
        {rewardPoolData.recipients
          .sort((a, b) => a.place - b.place)
          .map(recipient => (
            <div className="group relative" key={recipient.id}>
              <div className="grid grid-cols-2 justify-between items-center border-t border-primary-2 py-3">
                <div className="flex gap-4">
                  <CreateRewardsPoolRecipientsDropdown
                    options={rankOptions}
                    defaultOption={rankOptions[recipient.place - 1]}
                    onChange={value => handlePlaceChange(value, recipient.id)}
                  />

                  <span className="text-[16px] text-neutral-14">place</span>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center relative">
                      <input
                        className="w-[120px] h-8 bg-neutral-9  text-true-black rounded-[8px] font-bold text-center appearance-none focus:outline-none"
                        type="number"
                        min="1"
                        max="100"
                        value={recipient.proportion}
                        onChange={event => handleProportionChange(event, recipient.id)}
                      />
                      <span className="text-[16px] absolute inset-y-1 right-2 text-primary-5 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>
              {rewardPoolData.recipients.length > 1 && (
                <div className="absolute top-1/2 right-[-30px] transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 cursor-pointer">
                  <TrashIcon
                    width={26}
                    height={26}
                    className="text-negative-11"
                    onClick={() => handleRemoveRecipient(recipient.id)}
                  />
                </div>
              )}
            </div>
          ))}

        <div className="grid grid-cols-2 justify-between border-t border-neutral-10 py-3 font-bold">
          <div className="text-neutral-14">Total</div>
          <div
            className={`justify-self-center ml-[68px] text-center ${proportionError ? "text-negative-11" : ""} ${
              totalProportion === 100 ? "bg-gradient-reward-recipients text-transparent bg-clip-text" : ""
            }`}
          >
            {formatProportion(totalProportion)}% <br />
            {proportionError && (
              <span>
                {formatProportion(Math.abs(totalProportion - 100))}% {proportionError}
              </span>
            )}
          </div>
        </div>
        {recipientsExceedLimit ? (
          <p className="text-[16px] text-negative-11 font-bold">{recipientsExceedLimit}</p>
        ) : null}
      </div>
    </div>
  );
};

export default CreateRewardsPoolRecipients;
