import { formatBalance } from "@helpers/formatBalance";
import { FC, useMemo } from "react";
import { formatEther, parseEther } from "viem";

interface DivBasedYAxisProps {
  price: number;
  yPosition: number;
  totalHeight: number;
  isCurrentPrice: boolean;
  isHoveredPrice: boolean;
}

const PriceCurveChartCustomYAxis: FC<DivBasedYAxisProps> = ({
  price,
  yPosition,
  totalHeight,
  isCurrentPrice,
  isHoveredPrice,
}) => {
  const config = useMemo(() => {
    if (isCurrentPrice) {
      return { bgColor: "bg-cyan-400", textColor: "text-white", fontWeight: "font-bold" };
    }
    if (isHoveredPrice) {
      return { bgColor: "bg-gray-500", textColor: "text-white", fontWeight: "font-bold" };
    }
    return { bgColor: "", textColor: "text-neutral-7", fontWeight: "font-normal" };
  }, [isCurrentPrice, isHoveredPrice]);

  const showBackground = config.bgColor !== "";

  // Format the price properly for small numbers
  const formattedPrice = useMemo(() => {
    const priceInWei = parseEther(price.toString());
    const formattedEther = formatEther(priceInWei);
    return formatBalance(formattedEther);
  }, [price]);

  // Calculate position as percentage from top
  const topPercentage = (yPosition / totalHeight) * 100;

  return (
    <div
      className="absolute flex items-center justify-start"
      style={{
        top: `${topPercentage}%`,
        transform: "translateY(-50%)",
        width: "100%",
      }}
    >
      <div
        className={`
          px-3 py-1 text-xs whitespace-nowrap
          ${showBackground ? `${config.bgColor} rounded-lg` : ""}
          ${config.textColor} ${config.fontWeight}
        `}
      >
        {formattedPrice} eth
      </div>
    </div>
  );
};

export default PriceCurveChartCustomYAxis;
