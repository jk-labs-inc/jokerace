import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import React, { Fragment, useState } from "react";

interface Recipient {
  id: number;
  place: number;
  proportion: number;
}

const CreateRewardsPoolRecipients: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([{ id: 1, place: 1, proportion: 0 }]);
  const [myEarnings, setMyEarnings] = useState(0);
  const jokeraceCommission = 2.5;
  const places = Array.from({ length: recipients.length }, (_, i) => i + 1);

  const handleAddRecipient = () => {
    const newRecipient: Recipient = {
      id: recipients.length + 1,
      place: recipients.length + 1,
      proportion: 0,
    };
    setRecipients([...recipients, newRecipient]);
  };

  const handleRemoveRecipient = (id: number) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id));
  };

  const handleProportionChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { value } = event.target;
    setRecipients(
      recipients.map(recipient => (recipient.id === id ? { ...recipient, proportion: parseFloat(value) } : recipient)),
    );
  };

  const totalProportion = recipients.reduce(
    (sum, recipient) => sum + recipient.proportion,
    myEarnings + jokeraceCommission,
  );

  const handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const newPlace = parseInt(event.target.value);
    const recipientToSwap = recipients.find(recipient => recipient.place === newPlace);

    if (recipientToSwap) {
      const newRecipients = recipients.map(recipient => {
        if (recipient.id === id) {
          return { ...recipient, place: newPlace };
        } else if (recipient.id === recipientToSwap.id) {
          const originalRecipient = recipients.find(recipient => recipient.id === id);
          return { ...recipient, place: originalRecipient?.place || recipient.place };
        } else {
          return recipient;
        }
      });
      setRecipients(newRecipients.sort((a, b) => a.place - b.place));
    }
  };

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
        {recipients.map((recipient, index) => (
          <div key={recipient.id} className="grid grid-cols-2 justify-between border-t border-neutral-10 py-3 pr-4">
            <div>
              <select value={recipient.place} onChange={event => handlePlaceChange(event, recipient.id)}>
                {places.map(place => (
                  <option key={place} value={place}>
                    {ordinalSuffix(place)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={recipient.proportion}
                onChange={event => handleProportionChange(event, recipient.id)}
              />
              <span>%</span>
              <button onClick={() => handleRemoveRecipient(recipient.id)}>🗑️</button>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-10 py-3 pr-4">
          <div>My own earnings</div>
          <div>
            <input
              type="number"
              min="0"
              max="100"
              value={myEarnings}
              onChange={event => setMyEarnings(parseFloat(event.target.value))}
            />
            <span>%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-10 py-3 pr-4">
          <div>Jokerace commission</div>
          <div>2.5%</div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-10 py-3 pr-4">
          <div>Total</div>
          <div>{totalProportion.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsPoolRecipients;
