import AddFundsCard from "@components/AddFunds/components/Card";
import AddFundsJumperWidget from "./components/Widget";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";

interface AddFundsJumperProviderProps {
  chain: string;
  asset: string;
}

const JUMPER_PARAMS = {
  name: "jumper exchange",
  description: "0% fees",
  logo: "/add-funds/jumper.png",
  logoBorderColor: "#BFA1EB",
};

const AddFundsJumperProvider: FC<AddFundsJumperProviderProps> = ({ chain, asset }) => {
  const isEntryPage = usePathname().includes("submission");
  const [showWidget, setShowWidget] = useState(false);

  const handleCardClick = () => {
    setShowWidget(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <AddFundsCard
        {...JUMPER_PARAMS}
        descriptionClassName={isEntryPage ? "text-[14px]" : ""}
        onClick={handleCardClick}
      />
      {showWidget && (
        <AddFundsJumperWidget
          integrator="JokeRace"
          border="1px solid rgb(234, 234, 234)"
          borderRadius="16px"
          className="w-full"
        />
      )}
    </div>
  );
};

export default AddFundsJumperProvider;
