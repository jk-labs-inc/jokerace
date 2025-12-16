import Ticker from "@components/UI/Ticker";
import { useRef, useEffect, useState } from "react";

const PROJECTS = ["arbitrum", "boysclub", "eigenlayer", "ethdenver", "ethfoundation", "megaeth", "polygon"];

const LandingPageUsedBy: React.FC = () => {
  const sortedProjects = [...PROJECTS].sort();

  const tickerItems = sortedProjects.map(project => (
    <img key={project} src={`/used-by/${project}.svg`} alt={`${project} logo`} className="h-12 w-auto" />
  ));

  return (
    <div className="flex flex-col gap-4 md:gap-8 py-4 md:py-8 pr-6 pl-4 md:pl-16 3xl:pl-20 border-t border-b border-neutral-7">
      <p className="text-[16px] md:text-[24px] font-bold text-neutral-11">as used by</p>
      <div className="hidden xl:flex justify-between">
        {sortedProjects.map(project => (
          <img key={project} src={`/used-by/${project}.svg`} alt={`${project} logo`} className="h-12 w-auto" />
        ))}
      </div>
      <div className="xl:hidden">
        <Ticker items={tickerItems} velocity={50} gap={32} pauseOnHover={false} />
      </div>
    </div>
  );
};

export default LandingPageUsedBy;
