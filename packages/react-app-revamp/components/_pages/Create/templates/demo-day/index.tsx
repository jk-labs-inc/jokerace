import { useMediaQuery } from "react-responsive";

const CreateContestDemoDayTemplate = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px] normal-case">
      <p>For a demo day, you’ll need:</p>
      <ul className="pl-8 list-disc">
        <li className="font-bold">A title</li>
      </ul>
      <p>
        <b>Duration: 2 days.</b> We’ll give builders the next day to submit their projects, and {!isMobile && <br />}{" "}
        audiences the following day to vote.
      </p>
      <p>By default, we’ll let anyone submit and anyone vote.</p>
      <p className="font-bold">You’ll have the chance to modify any settings you like.</p>
    </div>
  );
};

export default CreateContestDemoDayTemplate;
