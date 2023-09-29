import ButtonV3 from "@components/UI/ButtonV3";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Recipient {
  id: number;
  place: number;
  proportion: number;
}

const CreateRewardsPoolRecipients: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([{ id: 0, place: 1, proportion: 100 }]);
  const [nextId, setNextId] = useState(1);
  const { setRanks, setShares, setValidationError } = useDeployRewardsStore(state => state);

  useEffect(() => {
    const sortedRecipients = [...recipients].sort((a, b) => a.place - b.place);
    setRanks(sortedRecipients.map(recipient => recipient.place));
    setShares(sortedRecipients.map(recipient => recipient.proportion));

    const totalProportion = recipients.reduce(
      (sum, recipient) => sum + (isNaN(recipient.proportion) ? 0 : recipient.proportion),
      0,
    );

    let error = {};

    if (totalProportion !== 100) {
      error = {
        ...error,
        invalidTotal: `Total percentage should be exactly 100%, currently it's ${totalProportion}%`,
      };
    }

    const uniqueRanks = [...new Set(recipients.map(recipient => recipient.place))];
    if (uniqueRanks.length < recipients.length) {
      error = { ...error, duplicateRank: "There can't be duplicate ranks" };
    }

    const zeroProportionRecipients = recipients.filter(recipient => recipient.proportion === 0);
    if (zeroProportionRecipients.length > 0) {
      error = { ...error, zeroProportion: "Recipients with 0% proportion are not allowed" };
    }

    setValidationError(error);
  }, [recipients, setRanks, setShares, setValidationError]);

  const handleAddRecipient = () => {
    const nextPlace = recipients.length + 1 <= 100 ? recipients.length + 1 : 1;
    setRecipients(prevRecipients => [...prevRecipients, { id: nextId, place: nextPlace, proportion: 0 }]);
    setNextId(prevId => prevId + 1);
  };

  const handleRemoveRecipient = (id: number) => {
    if (recipients.length > 1) {
      setRecipients(prevRecipients => prevRecipients.filter(recipient => recipient.id !== id));
    }
  };

  const handleProportionChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    let { value } = event.target;
    let updatedProportion = parseFloat(value);

    if (updatedProportion > 100) {
      updatedProportion = 100;
    }

    setRecipients(prevRecipients =>
      prevRecipients.map(recipient =>
        recipient.id === id ? { ...recipient, proportion: updatedProportion } : recipient,
      ),
    );
  };

  const handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const newPlace = parseInt(event.target.value);

    setRecipients(prevRecipients =>
      prevRecipients.map(recipient => (recipient.id === id ? { ...recipient, place: newPlace } : recipient)),
    );
  };

  const totalProportion = recipients.reduce(
    (sum, recipient) => sum + (isNaN(recipient.proportion) ? 0 : recipient.proportion),
    0,
  );
  const proportionError = totalProportion > 100 ? "over" : totalProportion < 100 ? "under" : null;

  return (
    <div className="md:w-[370px]">
      <div className="flex justify-end">
        <ButtonV3 onClick={handleAddRecipient} colorClass="bg-primary-10">
          + Add recipient
        </ButtonV3>
      </div>
      <div className="mt-5 text-[16px]">
        <div className="grid grid-cols-2 justify-between mb-3 pr-2 text-neutral-11 font-bold">
          <span className="uppercase">Recipient</span>
          <span className="uppercase text-right">Proportion</span>
        </div>
        {recipients
          .sort((a, b) => a.place - b.place)
          .map(recipient => (
            <div className="group" key={recipient.id}>
              <div className="grid grid-cols-2 justify-between items-center border-t border-neutral-10 py-3 pr-2">
                <div className="flex gap-2">
                  <select
                    className="w-[60px] h-[24px] pb-1 bg-neutral-11 opacity-70 text-true-black rounded-[5px] font-bold"
                    value={recipient.place}
                    onChange={event => handlePlaceChange(event, recipient.id)}
                  >
                    {[...Array(100)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {ordinalSuffix(i + 1)}
                      </option>
                    ))}
                  </select>
                  <span className="text-[16px] text-neutral-11">place</span>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-[60px] h-[24px] bg-neutral-11 opacity-70 text-true-black rounded-[5px] font-bold text-center appearance-none"
                      type="number"
                      min="1"
                      max="100"
                      value={recipient.proportion}
                      onChange={event => handleProportionChange(event, recipient.id)}
                    />
                    <span className="text-neutral-10">%</span>
                  </div>
                  {recipients.length > 1 ? (
                    <div className="flex w-[18px] justify-center">
                      <div
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      >
                        <Image
                          src="/create-flow/trashcan.png"
                          width={18}
                          height={18}
                          alt="trashcan"
                          className="mt-[2px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-[18px]"></div>
                  )}
                </div>
              </div>
            </div>
          ))}

        <div className="grid grid-cols-2 justify-between border-t border-neutral-10 py-3 font-bold">
          <div>Total</div>
          <div
            className={`justify-self-center ml-5 text-center ${proportionError ? "text-negative-11" : ""} ${
              totalProportion === 100 ? "gradient-100" : ""
            }`}
          >
            {totalProportion.toFixed(2)}% <br />
            {proportionError && (
              <span>
                {Math.abs(totalProportion - 100).toFixed(2)}% {proportionError}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsPoolRecipients;
