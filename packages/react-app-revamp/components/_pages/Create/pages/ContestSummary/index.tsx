import { useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import ErrorMessage from "../../components/Error";
import TipMessage from "../../components/Tip";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";

const CreateContestSummary = () => {
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
      <Description step={3} title="what’s a 2-3 word summary of how to participate in your contest?" />
      <div className="mt-7 ml-[70px]">
        <input
          type="text"
          className="border-b border-neutral-11 bg-transparent pb-2 outline-none  placeholder-neutral-9 w-[550px]"
          placeholder="eg. “submit a project” “propose a delegate” “predict the market”"
          minLength={CONTEST_TITLE_MIN_LENGTH}
          maxLength={CONTEST_TITLE_MAX_LENGTH}
          onChange={handleInputChange}
        />
        {error.length ? (
          <ErrorMessage error={error} />
        ) : (
          <TipMessage tip="we’ll use this to summarize and promote your contest on our site" error={""} />
        )}
        <div className="mt-12">
          <CreateNextButton step={3} />
        </div>
      </div>
    </>
  );
};

export default CreateContestSummary;
