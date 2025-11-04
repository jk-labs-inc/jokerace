const NoRewardsInfo = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <img src="/rewards/rewards-not-created.png" alt="no rewards" width={558} height={360} />
      <div className="flex flex-col gap-4">
        <p className="text-[20px] md:text-[24px] text-neutral-11">
          this contest’s creator hasn’t set up a rewards pool... yet.
        </p>
        <p className="text-[16px] md:text-[20px] text-neutral-11 font-bold">maybe... politely ask them to do so?</p>
      </div>
    </div>
  );
};

export default NoRewardsInfo;
