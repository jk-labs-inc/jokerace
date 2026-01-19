import { ROUTE_CREATE_CONTEST } from "@config/routes";
import CustomLink from "@components/UI/Link";

const CreateContests = () => {
  return (
    <div className="flex w-full md:w-1/2 justify-between">
      <div className="flex flex-col gap-6 h-full">
        <p className="text-2xl md:text-3xl font-normal">
          <span className="hidden md:inline">
            and finally... <br />
          </span>
          earn by <span className="text-positive-11 font-bold">creating contests.</span>
        </p>
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-4 text-base md:text-xl text-neutral-11 max-w-[400px]">
            <p>create a contest on any subjective question you like.</p>
            <p>
              who was best player in a game? best <br className="hidden md:block" />
              dressed? best personality?
            </p>
            <p>
              opt in to earn 5% of <span className="font-bold text-true-white">all volume</span> on the contest.
            </p>
          </div>
          <CustomLink
            href={ROUTE_CREATE_CONTEST}
            className="mt-auto bg-positive-11 text-base text-true-black font-bold normal-case w-[211px] px-2 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ease-out hover:brightness-110 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
          >
            create a contest and earn
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default CreateContests;
