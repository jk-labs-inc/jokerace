import { useMediaQuery } from "react-responsive";
import ActionButton from "../../components/ActionButton";
import AnimatedSection from "../../components/AnimatedSection";
import ListItem from "../../components/ListItem";
import SectionTitle from "../../components/SectionTitle";

const BuildProtocolSection = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <AnimatedSection>
      <SectionTitle>to build on our protocol:</SectionTitle>
      <ul className="flex flex-col pl-4 gap-2">
        <ListItem>
          {isMobile
            ? "it's permissionless: we're open source onchain"
            : "we're open source and onchain—so anyone can build on us"}
        </ListItem>
        <ListItem>
          {isMobile ? (
            "build an extension to extend contest features and drive users to your service"
          ) : (
            <>
              build an extension to extend contest features and drive <br /> users to your service (ie analytics,
              points, predictions, etc.)
            </>
          )}
        </ListItem>
        <ListItem>
          {isMobile ? (
            "build a circuit: a smart contract that lets players perform any action with their fees"
          ) : (
            <>
              build a circuit: a smart contract that lets players perform <br /> any action with their fees (buy tokens,
              products, etc)
            </>
          )}
        </ListItem>
      </ul>
      <ActionButton href="https://docs.jokerace.io/" external>
        Read Our Docs
      </ActionButton>
    </AnimatedSection>
  );
};

export default BuildProtocolSection;
