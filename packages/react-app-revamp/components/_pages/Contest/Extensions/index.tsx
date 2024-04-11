import { useMediaQuery } from "react-responsive";
import ExtensionsList from "./components/List";

const ContestExtensions = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col gap-8">
      {isMobile ? (
        <p className="text-neutral-11 text-[16px] normal-case">
          extensions are integrations with other services <br />
          to unlock your contest with new utilities. <i>anyone</i> <br />
          can build an extension, and these are some favs:
        </p>
      ) : (
        <p className="text-neutral-11 text-[20px] normal-case">
          extensions are JokeRace integrations built by other services on top of our contests that let you access new
          forms of analytics, incentives, and <br />
          rewards. <i>anyone</i> can build an extension, and we feature our favorites here.
        </p>
      )}

      <ExtensionsList />
    </div>
  );
};

export default ContestExtensions;
