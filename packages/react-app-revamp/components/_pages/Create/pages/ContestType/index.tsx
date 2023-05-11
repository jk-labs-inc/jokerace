import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import CreateDropdown from "../../components/Dropdown";

const CreateContestType = () => {
  const additionalContent = (
    <p>
      contests let people submit responses to a prompt and vote on favorites.
      <br />
      you decide who submits, who votes, and how many votes they have.
    </p>
  );
  return (
    <>
      <Description
        step={1}
        title="how would you like your contest to be listed for users to find?"
        additionalContent={additionalContent}
      />
      <div className="mt-7 ml-[70px]">
        <CreateDropdown />
        <div className="mt-12">
          <CreateNextButton step={1} />
        </div>
      </div>
    </>
  );
};

export default CreateContestType;
