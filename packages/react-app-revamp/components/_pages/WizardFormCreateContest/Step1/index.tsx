import Button from "@components/Button";
import { useStore } from "../store";
import type { WizardFormState } from '../store'
export const Step1 = () => {
  //@ts-ignore
  const stateWizardForm: WizardFormState = useStore();

  return (
    <>
      <h2 className="sr-only">What is a contest ?</h2>
      <div className="tracking-wide text-md space-y-3">
        <p className="font-bold text-lg">Let’s set up a contest.</p>
        <p>
          <span >Contests</span> let your community submit options and vote on them on{" "}
          <span >any major chain</span>.
        </p>
        <p>
          You can use them for{" "}
          <span >governance, endorsements, curation, bounties, grants, giveaways, or games</span>.
        </p>
        <p>
          To create one, we’ll{" "}
          <span >mint a voting token, set the rules, and then airdrop the token</span> to your
          community.
        </p>
        <p className="font-bold">Sound good ?</p>
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
