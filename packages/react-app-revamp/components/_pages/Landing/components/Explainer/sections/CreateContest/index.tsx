import { ROUTE_CREATE_CONTEST } from "@config/routes";
import ActionButton from "../../components/ActionButton";
import AnimatedSection from "../../components/AnimatedSection";
import ListItem from "../../components/ListItem";
import SectionTitle from "../../components/SectionTitle";

const CreateContestSection = () => {
  return (
    <AnimatedSection>
      <SectionTitle>to create a contest for free:</SectionTitle>
      <ul className="flex flex-col pl-4 gap-2">
        <ListItem>pick who can submit entries and what they should look like</ListItem>
        <ListItem>decide what the price curve looks like</ListItem>
        <ListItem>set the voting period</ListItem>
        <ListItem>add rewards and descriptions</ListItem>
        <ListItem>that's it!</ListItem>
      </ul>
      <ActionButton href={ROUTE_CREATE_CONTEST}>Create a Contest</ActionButton>
    </AnimatedSection>
  );
};

export default CreateContestSection;
