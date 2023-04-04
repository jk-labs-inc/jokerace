import Search from "@components/Search";
import Sort from "@components/Sort";
import Button from "@components/UI/Button";
import { ClockIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import Head from "next/head";

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>JokeDAO - open-source, collaborative decision-making platform</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <div className="pl-16 pr-16 mt-6 max-w-[1350px] 2xl:pl-28 2xl:pr-0">
        <div className="mb-20">
          <p className="text-[24px] font-bold">
            contests for communities to make, <br />
            execute, and reward decisions
          </p>
        </div>

        <div className="flex justify-between w-4/6">
          <div className="w-1/3">
            <div className="text-[16px] font-bold  mb-1">stage one</div>
            <div className="h-1 bg-secondary-11"></div>
            <div className="text-[16px]  font-bold mt-1 text-secondary-11">creator asks a prompt</div>
          </div>
          <div className="w-1/3">
            <div className="text-[16px] font-bold   mb-1">stage two</div>
            <div className="h-1 bg-primary-10"></div>
            <div className="text-[16px]  font-bold mt-1 text-primary-10">submitters respond</div>
          </div>
          <div className="w-1/3">
            <div className="text-[16px] font-bold  mb-1">stage three</div>
            <div className="h-1 bg-positive-11"></div>
            <div className="text-[16px] font-bold mt-1 text-positive-11">voters pick top submmissions</div>
          </div>
        </div>

        <div className="grid grid-row-1 grid-cols-4 my-5 items-center mt-12">
          <p className="text-[20px] text-true-white font-sabo">Featured contests</p>
          <Search />
          {/* <Sort /> */}
        </div>

        <div className="grid grid-rows-4 text-[16px]">
          <div className="grid grid-cols-4 border-t border-neutral-9 py-5 items-center">
            <div className="flex items-center gap-4">
              <img src="/polygon.svg" />

              <div className="flex flex-col">
                <p>jokecouncil race 69</p>
                <p>tell a joke to win</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-primary-10">
                <p>submissions are open</p>
                <p>
                  for <span className="uppercase">$matic</span> holders
                </p>
              </div>
              <ClockIcon className="w-10" />
            </div>

            <div className="flex flex-col">
              <p>voting opens march 19</p>
              <p>
                for <span className="uppercase">$MATIC</span> holders
              </p>
            </div>

            <div className="flex flex-col">
              <p>
                1000 <span className="uppercase">$JOKE</span>
              </p>
              <p>to 3 winners</p>
            </div>
          </div>

          <div className="grid grid-cols-4 border-t border-neutral-9 py-5">
            <div className="flex items-center gap-4">
              <img src="/polygon.svg" />

              <div className="flex flex-col">
                <p>jokecouncil race 69</p>
                <p>tell a joke to win</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-primary-10">
                <p>submissions are open</p>
                <p>
                  for <span className="uppercase">$matic</span> holders
                </p>
              </div>
              <ClockIcon className="w-10" />
            </div>

            <div className="flex flex-col">
              <p>voting opens march 19</p>
              <p>
                for <span className="uppercase">$MATIC</span> holders
              </p>
            </div>

            <div className="flex flex-col">
              <p>
                1000 <span className="uppercase">$JOKE</span>
              </p>
              <p>to 3 winners</p>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t border-neutral-9 py-5">
            <div className="flex items-center gap-4">
              <img src="/polygon.svg" />

              <div className="flex flex-col">
                <p>jokecouncil race 69</p>
                <p>tell a joke to win</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-primary-10">
                <p>submissions are open</p>
                <p>
                  for <span className="uppercase">$matic</span> holders
                </p>
              </div>
              <ClockIcon className="w-10" />
            </div>

            <div className="flex flex-col">
              <p>voting opens march 19</p>
              <p>
                for <span className="uppercase">$MATIC</span> holders
              </p>
            </div>

            <div className="flex flex-col">
              <p>
                1000 <span className="uppercase">$JOKE</span>
              </p>
              <p>to 3 winners</p>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t border-neutral-9 py-5">
            <div className="flex items-center gap-4">
              <img src="/polygon.svg" />

              <div className="flex flex-col">
                <p>jokecouncil race 69</p>
                <p>tell a joke to win</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-primary-10">
                <p>submissions are open</p>
                <p>
                  for <span className="uppercase">$matic</span> holders
                </p>
              </div>
              <ClockIcon className="w-10" />
            </div>

            <div className="flex flex-col">
              <p>voting opens march 19</p>
              <p>
                for <span className="uppercase">$MATIC</span> holders
              </p>
            </div>

            <div className="flex flex-col">
              <p>
                1000 <span className="uppercase">$JOKE</span>
              </p>
              <p>to 3 winners</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button className="bg-primary-10 text-[18px] w-[146px] font-bold">View all</Button>
        </div>
      </div>
      <div className="flex pl-16 pr-16 2xl:pl-28 2xl:pr-0 gap-10 mt-10 ">
        <div className="p-4">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
                1
              </div>
              <p className="text-[24px] text-primary-10 font-bold">create a prompt</p>
              <ul className="list-disc list-inside text-[16px] font-bold">
                <li>"submit a new grant proposal"</li>
                <li>"design our new logo"</li>
                <li>"what features should we build?"</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
                2
              </div>
              <p className="text-[24px] text-primary-10 font-bold">pick who submits</p>
              <ul className="list-disc list-inside text-[16px] font-bold">
                <li>let anyone submit responses—</li>
                <li>or set requirements for who gets to respond.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
                3
              </div>
              <p className="text-[24px] text-primary-10 font-bold">pick who votes</p>
              <ul className="list-disc list-inside text-[16px] font-bold">
                <li>set requirements for who gets to vote</li>
                <li>pick how many votes they each get.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
                4
              </div>
              <p className="text-[24px] text-primary-10 font-bold">reward the winners</p>
              <ul className="list-disc list-inside text-[16px] font-bold">
                <li>set a rewards pool to winners,</li>
                <li>decide what percent each rank gets</li>
                <li>invite others to fund the pool too</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-col gap-6">
            <div className="p-10 w-[490px] h-[446px] borderTopLeftDotted">
              <p className="uppercase font-sabo text-[20px] text-center">
                grants,
                <br /> hackathons, <br /> bounties, music contests
              </p>
              <div className="flex items-center flex-col mt-6">
                <div className="flex items-center gap-3">
                  <img src="/explainer/first-slice/submission-ellipse.png" width={180} />
                  <img src="/explainer/arrow.png" width={50} height={35} />
                  <p className="text-[16px] font-bold">anyone submits (grants, projects, ideas, art, etc) </p>
                </div>
                <div className="flex items-center gap-5">
                  <img src="/explainer/first-slice/vote-ellipse.png" width={80} />
                  <img src="/explainer/arrow.png" width={30} height={35} />
                  <p className="text-[16px] font-bold">
                    jury votes <br /> on favorites{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-10 w-[490px] h-[446px] borderBottomLeftDotted">
              <p className="uppercase font-sabo text-[20px] text-center">
                proposals, <br />
                budgets, roadmaps
              </p>
              <div className="flex items-center flex-col mt-6">
                <div className="flex items-center gap-3">
                  <img src="/explainer/first-slice/submission-ellipse.png" width={180} />
                  <img src="/explainer/arrow.png" width={50} height={35} />
                  <p className="text-[16px] font-bold">anyone submits (grants, projects, ideas, art, etc) </p>
                </div>
                <div className="flex items-center gap-5">
                  <img src="/explainer/first-slice/vote-ellipse.png" width={80} />
                  <img src="/explainer/arrow.png" width={30} height={35} />
                  <p className="text-[16px] font-bold">
                    jury votes <br /> on favorites{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-10 gap-9 w-[490px] h-[446px] borderBottomRight">
            <p className="uppercase font-sabo text-[20px] text-center">
              elections,
              <br /> feature requests, <br /> pulse checks, giveaways
            </p>
            <p className="text-[16px] font-bold text-center">
              your community submits (requests for jobs, features, classes, content, etc) and then they vote on
              favorites
            </p>
            <img src="/explainer/arrow.png" width={50} className="rotate-[243deg]" />
            <img src="/explainer/last-slice/donut.png" width={200} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
