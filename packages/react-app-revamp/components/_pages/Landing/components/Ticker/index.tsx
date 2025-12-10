import Ticker from "@components/UI/Ticker";
import TickerText from "./components/TickerText";

const LandingPageTicker = () => {
  return (
    <Ticker
      className="bg-positive-18 h-12 flex items-center fixed top-0 left-0 right-0 z-50"
      items={[
        <img src="/landing/snake.svg" alt="" className="h-8" />,
        <TickerText>THE EARLIER YOU VOTE THE MORE YOU CAN EARN</TickerText>,
        <img src="/landing/confetti.svg" alt="confetti" className="w-12 h-12" />,
        <TickerText>$1,500,000 GENERATED FOR VOTERS</TickerText>,
      ]}
    />
  );
};

export default LandingPageTicker;
