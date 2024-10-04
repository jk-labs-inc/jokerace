import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";

interface VoterRowData {
  votesPerAddress: Record<string, number>;
  addresses: string[];
}

const VoterRow = ({ index, style, data }: { index: number; style: React.CSSProperties; data: VoterRowData }) => {
  const { votesPerAddress, addresses } = data;
  const address = addresses[index];
  return (
    <div
      style={style}
      className="flex justify-between items-end text-[16px] font-bold pb-3 pr-2 border-b border-neutral-10"
    >
      <UserProfileDisplay ethereumAddress={address} shortenOnFallback={true} />
      <p>{formatNumberAbbreviated(votesPerAddress[address])} votes</p>
    </div>
  );
};

export default VoterRow;
