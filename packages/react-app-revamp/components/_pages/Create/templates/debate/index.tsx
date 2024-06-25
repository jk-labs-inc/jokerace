import { useMediaQuery } from "react-responsive";

const CreateContestDebateTemplate = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px] normal-case">
      <p>For a debate, you’ll need:</p>
      <ul className="pl-8 list-disc">
        <li className="font-bold">A title</li>
      </ul>
      <p>
        <b>Duration: 24.5 hours.</b> Once you create the contest, submit the contestants {!isMobile && <br />} yourself
        in the next 30 minutes.
      </p>
      <p>Then anyone can vote on them over the next 24 hours.</p>
      <p className="font-bold">You’ll have the chance to modify any settings you like.</p>
    </div>
  );
};

export default CreateContestDebateTemplate;
