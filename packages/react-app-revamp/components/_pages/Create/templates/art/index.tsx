import { useMediaQuery } from "react-responsive";

const CreateContestArtTemplate = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px]">
      <p>For an art contest, you’ll need:</p>
      <ul className="pl-8 list-disc">
        <li className="font-bold normal-case">A title</li>
        <li>
          <b>A list of judges.</b> You’ll need their wallet addresses and voting power (we {!isMobile && <br />}{" "}
          recommend 100 votes each).
        </li>
      </ul>
      <p>Don’t want to make a list? You can also allowlist tokenholders or anyone to vote.</p>
      <p>
        <b>Duration: 8 days. </b>We’ll give artists one week to submit their work, and judges one {!isMobile && <br />}{" "}
        day to vote.
      </p>
      <p className="font-bold">You’ll have the chance to modify any settings you like.</p>
    </div>
  );
};

export default CreateContestArtTemplate;
