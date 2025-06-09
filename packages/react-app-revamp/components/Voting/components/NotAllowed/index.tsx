const VotingNotAllowed = () => {
  return (
    <div className="flex flex-col gap-4">
      <img src="/contest/voting-not-allowed.png" alt="not allowed" width={200} height={200} />
      <p className="text-[24px] text-negative-11 font-bold">ruh-roh</p>
      <p className="text-[16px] text-negative-11">
        looks like you’re in a restricted jurisdiction, <br /> which is ineligible for voting in contests with <br />
        voter rewards.
      </p>
      <p className="text-[16px] text-neutral-11">
        if you have a <span className="uppercase">vpn</span> that’s mistaking your <br /> location, please turn it off
        and refresh.
      </p>
    </div>
  );
};

export default VotingNotAllowed;
