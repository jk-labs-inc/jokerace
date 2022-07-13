import styles from "./styles.module.css";
export const Timeline = () => {
  return (
    <div role="figure" aria-labelledby="timeline-contest-description">
      <ol className={`flex ${styles.pseudoTimeline}`}>
        <li
          title="Submissions period"
          className={`${styles.pseudoIndicator} pt-2 relative w-7/12 2xs:w-2/3 text-center text-[#D79EFF] border-t-secondary-9 border-t-2 border-solid`}
        >
          <span className="text-2xs 2xs:text-xs uppercase font-bold">Submissions</span>
        </li>
        <li
          title="Voting period"
          className={`${styles.pseudoIndicator} pt-2 relative w-5/12 2xs:w-1/3 text-center text-primary-10 border-t-primary-9 border-t-2 border-solid`}
        >
          <span className="text-2xs 2xs:text-xs uppercase font-bold">Voting</span>
        </li>
      </ol>
      <p className="sr-only" id="timeline-contest-description">
        Figure 1: Contest timeline
      </p>
    </div>
  );
};

export default Timeline;
