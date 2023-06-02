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
  const [recipients, setRecipients] = useState<Recipient[]>([{ id: 0, place: 1, proportion: 0 }]);
  const [nextId, setNextId] = useState(1);
  const { setRanks, setShares } = useDeployRewardsStore(state => state);

  useEffect(() => {
    const sortedRecipients = [...recipients].sort((a, b) => a.place - b.place);
    setRanks(sortedRecipients.map(recipient => recipient.place));
    setShares(sortedRecipients.map(recipient => recipient.proportion));
  }, [recipients]);

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
    const { value } = event.target;
    const updatedProportion = parseFloat(value);

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

  const totalProportion = recipients.reduce((sum, recipient) => sum + recipient.proportion, 0);

  return (
    <div className="w-[370px]">
      <div className="flex justify-end">
        <ButtonV3 onClick={handleAddRecipient} color="bg-primary-10">
          + Add recipient
        </ButtonV3>
      </div>
      <div className="mt-5 text-[16px]">
        <div className="grid grid-cols-2 justify-between mb-3 pr-4 text-neutral-11 font-bold">
          <span className="uppercase">Recipient</span>
          <span className="uppercase text-right">Proportion</span>
        </div>
        {recipients
          .sort((a, b) => a.place - b.place)
          .map(recipient => (
            <div key={recipient.id} className="grid grid-cols-2 justify-between border-t border-neutral-10 py-3 pr-4">
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
              <div className="flex items-center justify-end">
                <input
                  className="w-[60px] h-[24px] bg-neutral-11 opacity-70 text-true-black rounded-[5px] font-bold text-center"
                  type="number"
                  min="1"
                  max="100"
                  value={recipient.proportion}
                  onChange={event => handleProportionChange(event, recipient.id)}
                />
                <span>%</span>
                {recipients.length > 1 && (
                  <div onClick={() => handleRemoveRecipient(recipient.id)}>
                    <Image src="/create-flow/trashcan.png" width={18} height={18} alt="trashcan" className="mt-[2px]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        <div className="grid grid-cols-2 justify-between border-t border-neutral-10 py-3 pr-4">
          <div>Total</div>
          <div>{totalProportion.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsPoolRecipients;
