import { useMediaQuery } from "react-responsive";
import ContestParamsMetadataFields from "./components/Fields";

const ContestParamsMetadata = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <p className="text-[16px] md:text-[20px] text-neutral-11">
          {isMobile
            ? "add more fields for players to answer when submitting—for anyone to query and parse."
            : "add more fields players have to answer when submitting."}
        </p>
        {!isMobile ? (
          <p className="text-[16px] md:text-[20px] text-neutral-11">
            these answers will be onchain metadata—which you can <br /> query and execute on other onchain services.
          </p>
        ) : null}
      </div>
      <ContestParamsMetadataFields />
    </div>
  );
};

export default ContestParamsMetadata;
