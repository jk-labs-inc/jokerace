import Ticker from "@components/UI/Ticker";
import TickerText from "./components/TickerText";

const LandingPageTicker = () => {
  return (
    <Ticker
      className="bg-positive-18 h-12 flex items-center"
      items={[
        <TickerText>THE EARLIER YOU VOTE THE MORE YOU CAN EARN</TickerText>,
        <img src="/landing/confetti.svg" alt="confetti" className="w-12 h-12" />,
        <TickerText>
          <span
            className="text-2xl font-lato font-black"
            style={{
              WebkitTextStroke: "3px #BB65FF",
              WebkitTextFillColor: "#78ffc6",
              paintOrder: "stroke fill",
              textShadow: "-3px 3px 8px #BB65FF",
            }}
          >
            $
          </span>
          1,500,000 GENERATED FOR VOTERS
        </TickerText>,
        <img src="/landing/snake.svg" alt="" className="h-8" />,
      ]}
    />
  );
};

export default LandingPageTicker;
