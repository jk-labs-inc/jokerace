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
    // Hovered price takes priority over current price
    if (isHoveredPrice) {
      return { bgColor: "bg-neutral-0", textColor: "text-white", fontWeight: "font-normal" };
    }
    if (isCurrentPrice) {
      return { bgColor: "bg-secondary-11", textColor: "text-black", fontWeight: "font-normal" };
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

  return (
    <div
      className="absolute flex items-center justify-start"
      style={{
        top: `${yPosition}px`, // Use exact pixel position instead of percentage
        transform: "translateY(-50%)",
        width: "100%",
        zIndex: isHoveredPrice ? 20 : 10, // Higher z-index for hovered price
      }}
    >
      <div
        className={`
          px-3 py-2 text-[12px] w-[120px] whitespace-nowrap rounded-lg
          ${showBackground ? `${config.bgColor}` : ""}
          ${config.textColor} ${config.fontWeight}
        `}
      >
        {formattedPrice} eth
      </div>
    </div>
  );
};

export default PriceCurveChartCustomYAxis;
