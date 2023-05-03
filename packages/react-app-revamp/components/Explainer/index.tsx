/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
const Explainer = () => {
  return (
    <div className="pl-8 pr-8 md:pl-16 md:pr-16 mt-16 md:mt-32 gap-20 md:flex md:flex-col 3xl:pl-28 2xl:pr-0 2xl:flex-row animate-fadeInLanding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
            1
          </div>
          <p className="text-[24px] text-primary-10 font-bold">create a prompt</p>
          <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
            <li>"submit a proposal"</li>
            <li>"design our new logo"</li>
            <li>"what features should we build?"</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
            2
          </div>
          <p className="text-[24px] text-primary-10 font-bold">pick who can submit</p>
          <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
            <li>let anyone submit responses—</li>
            <li>or set requirements for who gets to respond.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
            3
          </div>
          <p className="text-[24px] text-primary-10 font-bold">pick who can vote</p>
          <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
            <li>set requirements for who gets to vote</li>
            <li>pick how many votes they each get.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
            4
          </div>
          <p className="text-[24px] leading-5  text-primary-10 font-bold">
            <span className="text-[16px]">optional</span>
            <br />
            reward the winners
          </p>
          <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
            <li>set a rewards pool to winners,</li>
            <li>decide what percent each rank gets</li>
            <li>invite others to fund the pool too</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 md:gap-0 mt-12 md:mt-0 md:ml-0 items-center">
        <div className="flex flex-col gap-24 md:gap-0">
          <div className="md:bg-[url('/explainer/bg-1.svg')] bg-no-repeat md:pt-7 md:w-[520px] transform md:hover:scale-120 transition-transform duration-500">
            <p className="uppercase font-sabo text-[20px] text-left md:text-center">
              grants,
              <br /> hackathons, awards <br /> bounties, remix contests
            </p>
            <div className="flex items-start gap-8 md:gap-0 md:items-center flex-col mt-6">
              <div className="flex items-center gap-3 -ml-[30px] md:ml-0">
                <img src="/explainer/Ellipse5.svg" alt="donut" className="w-[170px] md:w-auto " />
                <img src="/explainer/Arrow2.svg" alt="donut" className="w-[40px] md:w-auto" />
                <p className="text-[15px] md:text-[16px] font-bold pt-12">
                  anyone submits (grants, <br />
                  projects, ideas, art, etc){" "}
                </p>
              </div>
              <div className="ml-[50px] md:ml-0 flex items-center gap-5">
                <img src="/explainer/Ellipse3.svg" alt="donut" className="-mt-[60px] md:-mr-[25px]" />
                <img src="/explainer/Arrow3.svg" alt="donut" className="w-[30px] md:w-auto" />
                <p className="text-[15px] md:text-[16px] font-bold self-end">
                  jury votes <br /> on favorites{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="md:bg-[url('/explainer/bg-3.svg')] bg-no-repeat md:pt-32 md:w-[520px]  md:ml-8 transform md:hover:scale-120 transition-transform duration-500">
            <p className="uppercase font-sabo text-[20px] text-left md:text-center">
              proposals, <br />
              budgets, drafts, <br />
              amendments
            </p>
            <div className="flex items-start md:items-center flex-col mt-6">
              <div className="flex">
                <div className="flex flex-col items-start md:items-center gap-3">
                  <p className="text-[15px] md:text-[16px] font-bold">
                    a core team or creator submits <br />
                    (proposals, drafts of work, etc)
                  </p>
                  <img src="/explainer/Arrow1.svg" alt="donut" className="self-center md:self-auto -rotate-[21deg]" />
                  <img src="/explainer/Ellipse1.svg" alt="donut" className="self-end" />
                </div>
                <div className="flex flex-col items-center gap-6 md:gap-3">
                  <p className="text-[15px] md:text-[16px] font-bold">
                    the community votes on <br /> which gets implemented
                  </p>
                  <img src="/explainer/Arrow4.svg" alt="donut" className="-rotate-[16deg]" />
                  <img src="/explainer/Ellipse2.svg" alt="donut" className="-mt-[60px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-center gap-3 md:bg-[url('/explainer/bg-2.svg')] bg-no-repeat md:w-[580px] bg-contain md:pt-[120px] md:pl-[100px] md:-ml-[100px]  transform md:hover:scale-120 transition-transform duration-500">
          <p className="uppercase font-sabo text-[20px] text-left md:text-center">
            elections,
            <br /> feature requests, <br /> pulse checks, giveaways
          </p>
          <p className="text-[15px] md:text-[16px] font-bold text-left md:text-center">
            your community submits (requests for <br />
            jobs, features, classes, content, etc) <br /> and then they vote on favorites
          </p>
          <img src="/explainer/Arrow5.svg" alt="donut" className="ml-[55px] md:ml-0" />
          <img
            src="/explainer/Ellipse4.svg"
            alt="donut"
            className="w-[220px] md:w-auto -mt-[40px] md:-mt-[60px] -ml-[35px] md:ml-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Explainer;
