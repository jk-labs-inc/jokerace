import ChargeInfoContainer from "./components/Container";
import ChargeInfoCurve from "./components/Curve";

const ChargeInfo = () => {
  return (
    <ChargeInfoContainer className="text-neutral-9">
      <p>charge per vote:</p>
      <ChargeInfoCurve />
    </ChargeInfoContainer>
  );
};

export default ChargeInfo;
