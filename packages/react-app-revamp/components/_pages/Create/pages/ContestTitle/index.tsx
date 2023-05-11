import { useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import ErrorMessage from "../../components/Error";
import TipMessage from "../../components/Tip";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";

const CreateContestTitle = () => {
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue && (inputValue.length < CONTEST_TITLE_MIN_LENGTH || inputValue.length >= CONTEST_TITLE_MAX_LENGTH)) {
      setError("contest length should be 10-30 characters");
    } else {
      setError("");
    }
  };

  return (
    <>
      <Description step={2} title="what should we call your contest?" />
      <div className="mt-7 ml-[70px]">
        <input
          type="text"
          className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 pb-2 w-[400px]"
          placeholder="eg. bundlr bounty contest for devs"
          minLength={CONTEST_TITLE_MIN_LENGTH}
          maxLength={CONTEST_TITLE_MAX_LENGTH}
          onChange={handleInputChange}
        />
        {error.length ? (
          <ErrorMessage error={error} />
        ) : (
          <TipMessage tip="tip: include your community’s name for higher engagement" error={""} />
        )}
        <div className="mt-12">
          <CreateNextButton step={2} />
        </div>
      </div>
    </>
  );
};

export default CreateContestTitle;
