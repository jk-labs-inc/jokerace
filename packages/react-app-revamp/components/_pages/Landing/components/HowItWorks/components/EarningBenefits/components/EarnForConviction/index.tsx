import { LINK_ROI_CALCULATOR } from "@config/links";
import InteractivePriceCurve from "./components/InteractivePriceCurve";

const EarnForConviction = () => {
  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col gap-6 h-full">
        <p className="text-2xl md:text-3xl font-normal">
          earn more for <span className="text-positive-18 font-bold">your conviction</span>
        </p>
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-4 text-base md:text-xl text-neutral-11 max-w-[400px]">
            <p>
              jokerace's novel mechanism is a <span className="font-bold text-true-white">price curve.</span>
            </p>
            <p>the earlier you vote, the cheaper the votes, and the more you can earn.</p>
            <p>
              but be careful. if you wait too long, you <br className="hidden md:block" />
              might lose money... even if you vote on winners.
            </p>
          </div>
          <a
            href={LINK_ROI_CALCULATOR}
            rel="noopener noreferrer"
            target="_blank"
            className="mt-auto bg-positive-18 text-base text-true-black font-bold normal-case w-[211px] px-4 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ease-out hover:brightness-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
          >
            how to calculate ROI
          </a>
        </div>
      </div>
      <div className="hidden md:block">
        <InteractivePriceCurve />
      </div>
    </div>
  );
};

export default EarnForConviction;
