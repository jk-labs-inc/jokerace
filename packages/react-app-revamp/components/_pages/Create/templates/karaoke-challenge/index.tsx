import { useMediaQuery } from "react-responsive";

const CreateContestKaraokeChallengeTemplate = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px]">
      <p>For a karaoke challenge, you’ll need:</p>
      <ul className="pl-8 list-disc">
        <li className="font-bold normal-case">A title</li>
      </ul>
      <p>
        <b>Duration: 3 hours. </b> Singers gets 15 minutes to submit their name.
      </p>
      <p>Then anyone can vote on them over the next 2.75 hours.</p>
      <p className="font-bold">You’ll have the chance to modify any settings you like.</p>
    </div>
  );
};

export default CreateContestKaraokeChallengeTemplate;
