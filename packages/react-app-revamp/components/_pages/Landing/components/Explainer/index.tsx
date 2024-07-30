import Subscribe from "@components/Subscribe";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

const LandingPageExplainer = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setVisibleSections(prev => [...prev, index]);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    sectionRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      sectionRefs.current.forEach(ref => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  const sectionContent = [
    {
      title: "why jokerace?",
      content: (
        <>
          <ul className="flex flex-col pl-8 gap-2">
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile
                ? "contest creators make money: we split earnings"
                : "contest creators make money: we split all earnings 50/50"}
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile
                ? "players can earn rewards, points, credentials, etc"
                : "players can earn rewards, points, credentials, and more"}
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile
                ? "rewards are programmable & verifiable onchain"
                : "rewards are fully programmable and verifiable onchain"}
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              anyone can build and access extensions on us
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile
                ? "players' fees can perform any onchain action"
                : "players can perform any onchain action with their fees"}
            </li>
            {!isMobile && (
              <>
                <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
                  players build out social graphs of taste and attestations
                </li>
                <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
                  contests are optimized to be <i>social</i>
                </li>
              </>
            )}
          </ul>
          <Subscribe />
        </>
      ),
    },
    {
      title: "how it works",
      content: (
        <>
          <div className="flex flex-col gap-4 mdgap-6">
            <p className="text-neutral-11 text-[16px] md:text-[20px] font-bold">to create a contest:</p>
            <ul className="flex flex-col pl-8 gap-2">
              <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
                {isMobile
                  ? "let anyone submit and vote—or use allowlists"
                  : "let anyone submit and vote on entries—or use allowlists"}
              </li>
              <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
                set the duration for submission and voting
              </li>
              <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
                (optional) add rewards for winners
              </li>
              <li className="text-[16px] md:text-[20px] mt-4 md:mt-6 text-neutral-11 list-disc">
                {isMobile ? (
                  <>
                    <b>
                      <i>that's it.</i>
                    </b>{" "}
                    you just pay the cost to deploy
                  </>
                ) : (
                  <>
                    <b>
                      <i>that's it.</i>
                    </b>{" "}
                    you just pay the cost to deploy (often just cents).
                  </>
                )}
              </li>
            </ul>
          </div>
          <p className="text-neutral-11 text-[16px] md:text-[20px]">
            {isMobile ? (
              <>
                <i>tip:</i> first run a contest for a jury to pick top finalists; then run one for anyone to vote on the
                winner.
              </>
            ) : (
              <>
                {" "}
                <i>pro tip:</i> run a <i>quality</i> contest for a jury to pick finalists; then run <br />
                an <i>engagement</i> contest for anyone to vote on the winner.
              </>
            )}
          </p>
          <Link
            href={ROUTE_CREATE_CONTEST}
            className="w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative transition-all duration-300 hover:opacity-90"
          >
            <span className="mr-4 normal-case">Create a Contest</span>
            <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
          </Link>
        </>
      ),
    },
    {
      title: "to play in a contest:",
      content: (
        <>
          <ul className="flex flex-col pl-8 gap-2">
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              submit entries during the submission period
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              vote on entries during the voting period
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile
                ? "earn rewards, attestations, points, credentials"
                : "earn rewards, attestations, points, credentials, and more."}
            </li>
          </ul>
          <Link
            href={ROUTE_VIEW_LIVE_CONTESTS}
            className="w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative transition-all duration-300 hover:opacity-90"
          >
            <span className="mr-4 normal-case">View Contests</span>
            <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
          </Link>
        </>
      ),
    },
    {
      title: "to build on our protocol:",
      content: (
        <>
          <ul className="flex flex-col pl-8 gap-2">
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile
                ? "it's permissionless: we're open source onchain"
                : "we're open source and onchain—so anyone can build on us"}
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile ? (
                "build an extension to extend contest features and drive users to your service"
              ) : (
                <>
                  build an extension to extend contest features and drive <br /> users to your service (ie analytics,
                  points, predictions, etc.)
                </>
              )}
            </li>
            <li className="text-[16px] md:text-[20px] text-neutral-11 list-disc">
              {isMobile ? (
                "build a circuit: a smart contract that lets players perform any action with their fees"
              ) : (
                <>
                  {" "}
                  build a circuit: a smart contract that lets players perform <br /> any action with their fees (buy
                  tokens, products, etc)
                </>
              )}
            </li>
          </ul>
          <a
            href="https://docs.jokerace.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative transition-all duration-300 hover:opacity-90"
          >
            <span className="mr-4 normal-case">Read Our Docs</span>
            <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-12 pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-28 2xl:pr-0">
      {sectionContent.map((section, index) => (
        <div
          key={index}
          ref={el => {
            if (el) sectionRefs.current[index] = el;
          }}
          className={`flex flex-col gap-4 md:gap-6 opacity-0 transition-all duration-1000 ${
            visibleSections.includes(index) ? "animate-reveal opacity-100" : "translate-y-10"
          }`}
          style={{ transitionDelay: `${visibleSections.indexOf(index) * 200}ms` }}
        >
          <p className="text-neutral-11 text-[20px] md:text-[24px] font-bold">{section.title}</p>
          {section.content}
        </div>
      ))}
    </div>
  );
};

export default LandingPageExplainer;
