import AnimatedBlinkText from "@components/UI/AnimatedBlinkText";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC } from "react";
import { useShallow } from "zustand/shallow";

interface ChargeInfoExponentialProps {
  costToVote: string;
}

const ChargeInfoExponential: FC<ChargeInfoExponentialProps> = ({ costToVote }) => {
  const chainNativeCurrencySymbol = useContestConfigStore(
    useShallow(state => state.contestConfig.chainNativeCurrencySymbol),
  );

  return (
    <AnimatedBlinkText value={costToVote} blinkColor="#78FFC6">
      {costToVote} {chainNativeCurrencySymbol}
    </AnimatedBlinkText>
  );
};

export default ChargeInfoExponential;
