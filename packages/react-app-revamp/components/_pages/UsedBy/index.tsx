import React, { useRef, useEffect } from "react";

const PROJECTS = ["arbitrum", "boysclub", "eigenlayer", "ethdenver", "ethfoundation", "megaeth", "polygon"];

const UsedBy: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const scroll = () => {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1;
        }
      };

      const intervalId = setInterval(scroll, 30);

      return () => clearInterval(intervalId);
    }
  }, []);

  // Sort the projects alphabetically
  const sortedProjects = [...PROJECTS].sort();

  return (
    <div className="flex flex-col gap-4 md:gap-8 py-4 md:py-8 pr-6 pl-4 md:pl-16 lg:mt-6 3xl:pl-28 border-t border-b border-neutral-7">
      <p className="text-[16px] md:text-[24px] font-bold text-neutral-11">as used by</p>
      <div className="hidden md:flex justify-between">
        {sortedProjects.map(project => (
          <img key={project} src={`/used-by/${project}.svg`} alt={`${project} logo`} className="h-12 w-auto" />
        ))}
      </div>
      <div className="md:hidden overflow-hidden" ref={scrollRef}>
        <div className="flex whitespace-nowrap">
          {sortedProjects.concat(sortedProjects).map((project, index) => (
            <img
              key={`${project}-${index}`}
              src={`/used-by/${project}.svg`}
              alt={`${project} logo`}
              className="h-12 w-auto inline-block mx-4"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsedBy;
