import useProposal, { useStore } from "@hooks/useProposal";
import shallow from "zustand/shallow";

export const ListProposalVotes = () => {
  const { isLoading } = useProposal();
  const { votes, votesPerAddress } = useStore(
    state => ({
      //@ts-ignore
      votes: state.votes,
      votesPerAddress: state.votesPerAddress,
    }),
    shallow,
  );

  if (isLoading) return <span>Loading...</span>;
  if (votes === 0) return <span>No vote</span>;
  return (
    <section>
      <p className="font-bold mb-3">
        <span>Current votes:</span> <br />
        <span className="text-positive-9">{votes}</span>
      </p>
      <table className="text-xs">
        <caption className="sr-only">Votes details</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Ethereum address</th>
            <th scope="col">Votes</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(votesPerAddress).map(address => (
            <tr key={`${votesPerAddress[address].displayAddress}-${votesPerAddress[address].votes}`}>
              <td className="text-ellipsis font-mono overflow-hidden p-2">
                {votesPerAddress[address].displayAddress}:
              </td>{" "}
              <td className="p-2 font-bold">
                {new Intl.NumberFormat().format(parseFloat(votesPerAddress[address].votes.toFixed(2)))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ListProposalVotes;
