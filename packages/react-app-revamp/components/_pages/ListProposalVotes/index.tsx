import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Button from "@components/Button";
import Loader from "@components/Loader";
import useProposalVotes, { useStore as useStoreProposalVotes } from "@hooks/useProposalVotes";
import { useStore as useStoreContest } from "@hooks/useContest";
import shallow from "zustand/shallow";

interface ListProposalVotesProps {
  id: number;
}

export const ListProposalVotes = (props: ListProposalVotesProps) => {
  const { id } = props;
  const { isLoading, isSuccess, isError, retry } = useProposalVotes();
  const { listProposalsData } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
    }),
    shallow,
  );
  const { votesPerAddress } = useStoreProposalVotes(
    state => ({
      //@ts-ignore
      votesPerAddress: state.votesPerAddress,
      //@ts-ignore
      isListVotersLoading: state.isListVotersLoading,
    }),
    shallow,
  );
  return (
    <>
      <Transition
        show={isLoading}
        as={Fragment}
        enter="ease-out duration-300 delay-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div>
          <Loader classNameWrapper={!isLoading ? "hidden" : ""} scale="component">
            Loading the votes of this proposal, one moment please...{" "}
          </Loader>
        </div>
      </Transition>
      <Transition
        show={!isLoading && isError}
        as={Fragment}
        enter="ease-out duration-300 delay-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 "
      >
        <div className="flex flex-col">
          <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
            <p className="text-sm font-bold text-negative-10 text-center">
              Something went wrong while fetching the votes of this proposal.
            </p>
          </div>
          <Button
            onClick={() => retry()}
            className="mt-5 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
            intent="neutral-outline"
          >
            Try again
          </Button>
        </div>
      </Transition>
      <Transition
        show={isSuccess && !isLoading}
        as={Fragment}
        enter="ease-out duration-300 delay-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 "
      >
        <section>
          <p className="animate-appear font-bold mb-3">
            <span>Current votes:</span> <br />
            <span className="text-positive-9">
              {new Intl.NumberFormat().format(parseFloat(listProposalsData[id].votes.toFixed(2)))}
            </span>
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
                <tr
                  className="animate-appear"
                  key={`${votesPerAddress[address].displayAddress}-${votesPerAddress[address].votes}`}
                >
                  <td className="text-ellipsis font-mono overflow-hidden p-2">
                    {votesPerAddress[address].displayAddress}:
                  </td>
                  <td className="p-2 font-bold">
                    {new Intl.NumberFormat().format(parseFloat(votesPerAddress[address].votes.toFixed(2)))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </Transition>
    </>
  );
};

export default ListProposalVotes;
