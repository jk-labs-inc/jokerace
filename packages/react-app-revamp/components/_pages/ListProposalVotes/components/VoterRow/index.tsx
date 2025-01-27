import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";

interface VoterRowData {
  votesPerAddress: Record<string, number>;
  addresses: string[];
}

const VoterRow = ({ data }: { data: VoterRowData }) => {
  const { votesPerAddress, addresses } = data;
  const address = addresses[0];

  return (
    <div
      className={`flex justify-between items-center text-[16px] font-bold pb-1 ${addresses.length > 1 ? "border-b border-neutral-10" : ""}`}
    >
      <UserProfileDisplay ethereumAddress={address} shortenOnFallback={true} />
      <p>
        {formatNumberAbbreviated(votesPerAddress[address])} {votesPerAddress[address] === 1 ? "vote" : "votes"}
      </p>
    </div>
  );
};

export default VoterRow;
