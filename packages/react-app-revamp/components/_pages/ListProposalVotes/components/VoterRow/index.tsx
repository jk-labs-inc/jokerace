import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";

interface VoterRowData {
  votesPerAddress: Record<string, number>;
  address: string;
  addressesLength: number;
}

const VoterRow = ({ data }: { data: VoterRowData }) => {
  const { votesPerAddress, address, addressesLength } = data;

  return (
    <div
      className={`flex justify-between items-center text-[16px] font-bold pb-1 ${addressesLength > 1 ? "border-b border-neutral-2" : ""}`}
    >
      <UserProfileDisplay ethereumAddress={address} shortenOnFallback={true} />
      <p>
        {formatNumberAbbreviated(votesPerAddress[address])} {votesPerAddress[address] === 1 ? "vote" : "votes"}
      </p>
    </div>
  );
};

export default VoterRow;
