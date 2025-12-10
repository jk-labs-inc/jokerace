import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import ActionButton from "../../components/ActionButton";
import AnimatedSection from "../../components/AnimatedSection";
import ListItem from "../../components/ListItem";
import SectionTitle from "../../components/SectionTitle";

const HowItWorksSection = () => {
  return (
    <AnimatedSection>
      <SectionTitle size="lg">how it works</SectionTitle>
      <div className="flex flex-col gap-4 md:gap-6">
        <p className="text-neutral-11 text-[16px] md:text-[20px] font-bold">to play in a contest:</p>
        <ul className="flex flex-col pl-4 gap-2">
          <ListItem>buy as many votes as you like on entries (on a price curve)</ListItem>
          <ListItem>90% of funds go into a rewards pool</ListItem>
          <ListItem>vote on winning entries to earn your share of rewards</ListItem>
          <ListItem>vote earlier with conviction to earn more</ListItem>
        </ul>
      </div>
      <ActionButton href={ROUTE_VIEW_LIVE_CONTESTS}>View Contests</ActionButton>
    </AnimatedSection>
  );
};

export default HowItWorksSection;
