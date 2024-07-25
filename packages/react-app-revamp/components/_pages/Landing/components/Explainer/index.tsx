import Subscribe from "@components/Subscribe";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LandingPageExplainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-12 pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-28 2xl:pr-0 ${isVisible ? "animate-reveal" : "opacity-0"}`}
    >
      <div className="flex flex-col gap-6">
        <p className="text-neutral-11 text-[24px] font-bold">why jokerace?</p>
        <ul className="flex flex-col pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">
            contest creators make money: we split all earnings 50/50
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            players can earn rewards, points, credentials, and more
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            rewards are fully programmable and verifiable onchain
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">anyone can build and access extensions on us</li>
          <li className="text-[20px] text-neutral-11 list-disc">
            players can perform any onchain action with their fees
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            players build out social graphs of taste and attestations
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            contests are optimized to be <i>social</i>
          </li>
        </ul>
        <Subscribe />
      </div>
      <div className="flex flex-col gap-6">
        <p className="text-neutral-11 text-[24px] font-bold">how it works</p>
        <div className="flex flex-col gap-6">
          <p className="text-neutral-11 text-[20px] font-bold">to create a contest:</p>
          <ul className="flex flex-col pl-8">
            <li className="text-[20px] text-neutral-11 list-disc">
              let anyone submit and vote on entries—or use allowlists
            </li>
            <li className="text-[20px] text-neutral-11 list-disc">set the duration for submission and voting</li>
            <li className="text-[20px] text-neutral-11 list-disc">(optional) add rewards for winners</li>
            <li className="text-[20px] mt-6 text-neutral-11 list-disc">
              <b>
                <i>that’s it.</i>
              </b>{" "}
              you just pay the cost to deploy (often just cents).
            </li>
          </ul>
        </div>
        <p className="text-neutral-11 text-[20px]">
          <i>pro tip:</i> run a <i>quality</i> contest for a jury to pick finalists; then run <br />
          an <i>engagement</i> contest for anyone to vote on the winner.
        </p>
        <Link
          href={ROUTE_CREATE_CONTEST}
          className="w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative"
        >
          <span className="mr-4 normal-case">Create a Contest</span>
          <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-neutral-11 text-[24px] font-bold">to play in a contest:</p>
        <ul className="flex flex-col pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">submit entries during the submission period</li>
          <li className="text-[20px] text-neutral-11 list-disc">vote on entries during the voting period</li>
          <li className="text-[20px] text-neutral-11 list-disc">
            earn rewards, attestations, points, credentials, and more.
          </li>
        </ul>
        <Link
          href={ROUTE_VIEW_LIVE_CONTESTS}
          className="w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative"
        >
          <span className="mr-4 normal-case">View Contests</span>
          <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-neutral-11 text-[24px] font-bold">to build on our protocol:</p>
        <ul className="flex flex-col pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">
            we’re open source and onchain—so anyone can build on us
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            build an extension to extend contest features and drive <br /> users to your service (ie analytics, points,
            predictions, etc.)
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">
            build a circuit: a smart contract that lets players perform <br /> any action with their fees (buy tokens,
            products, etc)
          </li>
        </ul>
        <a
          href="https://docs.jokerace.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[218px] h-10 bg-gradient-purple-white rounded-[40px] normal-case text-[20px] font-bold text-true-black flex items-center justify-center relative"
        >
          <span className="mr-4 normal-case">Read Our Docs</span>
          <ChevronRightIcon className="w-6 h-6 text-true-black font-bold absolute right-2" />
        </a>
      </div>
    </div>
  );
};

export default LandingPageExplainer;
