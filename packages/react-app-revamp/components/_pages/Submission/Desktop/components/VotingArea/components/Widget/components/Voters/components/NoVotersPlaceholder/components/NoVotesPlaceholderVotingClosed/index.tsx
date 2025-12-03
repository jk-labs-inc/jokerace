import SubmissionEmailSignup from "@components/_pages/Submission/components/EmailSignup";

const NoVotesPlaceholderVotingClosed = () => {
  return (
    <div className="flex flex-col gap-14 mt-5">
      <p className="text-[16px] text-neutral-11">
        this entry didn’t get any votes... but it’s still a <br /> winner if you’re here.
      </p>
      <img src="/rewards/rewards-not-created.png" alt="no votes" />
      <div className="mt-2">
        <SubmissionEmailSignup />
      </div>
    </div>
  );
};

export default NoVotesPlaceholderVotingClosed;
