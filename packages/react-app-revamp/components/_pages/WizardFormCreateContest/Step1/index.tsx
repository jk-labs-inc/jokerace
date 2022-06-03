import Button from "@components/Button";
import { useStore } from "../store";

export const Step1 = () => {
  const stateWizardForm = useStore();

  return (
    <>
      <h2 className="sr-only">What is a contest ?</h2>
      <div className="tracking-wide text-md space-y-6">
        <p className="font-bold text-lg">Let’s set up a contest.</p>
        <p>
          <span className="font-bold">Contests</span> let your community submit options and vote on them on{" "}
          <span className="font-bold">any major chain</span>.
        </p>
        <p>
          You can use them for{" "}
          <span className="font-bold">governance, endorsements, curation, bounties, grants, giveaways, or games</span>.
        </p>
        <p>
          To create one, we’ll{" "}
          <span className="font-bold">mint a voting token, set the rules, and then airdrop the token</span> to your
          community.
        </p>
        <p className="font-bold">Sounds good ?</p>
        <Button
          className="w-full 2xs:w-auto"
          intent="neutral-outline"
          onClick={() => stateWizardForm.setCurrentStep(2)}
        >
          Let’s do it 🔥
        </Button>
      </div>
    </>
  );
};

export default Step1;
