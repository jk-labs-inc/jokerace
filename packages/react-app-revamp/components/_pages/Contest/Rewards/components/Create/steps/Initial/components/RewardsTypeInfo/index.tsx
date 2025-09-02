import { useMediaQuery } from "react-responsive";

const RewardsTypeInfo = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px]">
        let's pick how to fund a rewards pool for <b>voters—</b>then {isMobile ? "" : <br />}
        decide on the proportions that everyone gets.
      </p>
    </div>
  );
};

export default RewardsTypeInfo;
