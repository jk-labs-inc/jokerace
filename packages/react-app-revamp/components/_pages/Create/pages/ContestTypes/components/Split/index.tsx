import { PERCENTAGE_TO_CREATOR_DEFAULT, PERCENTAGE_TO_JKLABS_DEFAULT } from "constants/monetization";

const CreateContestTypesSplit = () => {
  return (
    <li className="font-bold">
      we'll split all charges with you {PERCENTAGE_TO_CREATOR_DEFAULT} (you)/{PERCENTAGE_TO_JKLABS_DEFAULT} (us) <br />{" "}
      <span className="font-normal">
        you can keep them, put them in a rewards pool for <br />
        contestants, or do any smart contract tomfoolery you like
      </span>
    </li>
  );
};
export default CreateContestTypesSplit;
