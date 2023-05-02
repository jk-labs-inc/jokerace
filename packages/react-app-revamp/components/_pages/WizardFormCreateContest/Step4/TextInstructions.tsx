import button from "@components/UI/Button/styles";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { copyToClipboard } from "@helpers/copyToClipboard";
import { DuplicateIcon } from "@heroicons/react/outline";
import Link from "next/link";
import shallow from "zustand/shallow";
import { useStore } from "../store";

const appearAsNeutralButton = button({ intent: "neutral-outline", scale: "lg", class: "w-full xs:w-auto" });
export const TextInstructions = () => {
  const { dataDeployVotingToken, dataDeploySubmissionToken, dataDeployContest, contestDeployedToChain } = useStore(
    state => ({
      //@ts-ignore
      contestDeployedToChain: state.contestDeployedToChain,
      //@ts-ignore
      dataDeployVotingToken: state.dataDeployVotingToken,
      //@ts-ignore
      dataDeploySubmissionToken: state.dataDeploySubmissionToken,
      //@ts-ignore:
      dataDeployContest: state.dataDeployContest,
    }),
    shallow,
  );

  return (
    <div className="space-y-7 leading-relaxed">
      <section>
        <h3 className="font-bold text-lg">
          Now let&apos;s airdrop your voting token to your community using{" "}
          <a rel="nofollow noreferrer" target="_blank" href="https://www.coinvise.co" className="link">
            Coinvise.
          </a>
        </h3>
        {dataDeployVotingToken?.address && (
          <>
            <p className="text-neutral-11 text-xs mt-3">
              As a reminder, your voting token address is: <br />
              <span className="relative inline-flex focus-within:text-opacity-50 hover:text-opacity-75">
                <button
                  onClick={() => copyToClipboard(dataDeployVotingToken?.address ?? "", "Token address copied !")}
                  title="Copy address"
                  className="w-full absolute z-10 inset-0 opacity-0"
                >
                  Copy address
                </button>
                <span className="pie-6 text-opacity-[inherit] text-neutral-12 font-mono overflow-hidden text-ellipsis">
                  {dataDeployVotingToken?.address ?? ""}
                </span>
                <DuplicateIcon className="absolute w-5 top-1/2 inline-end-0 -translate-y-1/2" />
              </span>
              {dataDeploySubmissionToken?.address &&
                dataDeployVotingToken?.address !== dataDeploySubmissionToken?.address && (
                  <>
                    and your submission token address is: <br />
                    <span className="relative inline-flex focus-within:text-opacity-50 hover:text-opacity-75">
                      <button
                        onClick={() =>
                          copyToClipboard(dataDeploySubmissionToken?.address ?? "", "Token address copied !")
                        }
                        title="Copy address"
                        className="w-full absolute z-10 inset-0 opacity-0"
                      >
                        Copy address
                      </button>
                      <span className="pie-6 text-opacity-[inherit] text-neutral-12 font-mono overflow-hidden text-ellipsis">
                        {dataDeploySubmissionToken?.address ?? ""}
                      </span>
                      <DuplicateIcon className="absolute w-5 top-1/2 inline-end-0 -translate-y-1/2" />
                    </span>
                  </>
                )}
              {dataDeployContest?.address && (
                <>
                  <br /> You can always find it on{" "}
                  <Link
                    className="link"
                    target={"_blank"}
                    href={{
                      pathname: ROUTE_VIEW_CONTEST,
                      //@ts-ignore
                      query: {
                        chain: contestDeployedToChain.name.toLowerCase().replace(" ", ""),
                        address: dataDeployContest?.address,
                      },
                    }}
                  >
                    the contest page
                  </Link>
                  .
                </>
              )}
            </p>
          </>
        )}
      </section>
      <section>
        <h3 className="font-bold text-lg mb-3">Here&apos;s how to airdrop.</h3>
        <ol className="list-decimal space-y-1 pis-4">
          <li>
            Go to{" "}
            <a rel="nofollow noreferrer" target="_blank" href="https://www.coinvise.co/airdrop" className="link">
              Coinvise&apos;s airdrop page
            </a>
            , and connect your wallet to the chain you created your token{" "}
            <span className="text-xs text-neutral-11">(ie polygon)</span>
          </li>
          <li>
            Tap <span className="font-bold">&quot;select token&quot;</span> and input your token address{" "}
            {dataDeployVotingToken?.address && " above"}
          </li>
          <li>
            Input wallet addresses and number of tokens each one gets — don&apos;t worry, we&apos;ll come back to this
            in a sec
          </li>
          <li>
            Press <span className="font-bold">&quot;next&quot;</span>, airdrop, and{" "}
            <span className="font-bold">you&apos;re done!</span>
          </li>
        </ol>
      </section>
      <section>
        <p className="italic text-lg text-neutral-11">Ok, but...</p>
        <h3 className="font-bold text-lg mb-3">How do we get the wallet addresses for your community?</h3>
        <section className="mb-6">
          <h4 className="text-md font-bold mb-1">Method one: Twitter thread</h4>
          <ol className="list-decimal space-y-1 pis-4">
            <li>Ask your community to drop a comment that includes their ENS in a Twitter thread</li>
            <li>
              Scroll down Coinvise&apos;s airdrop page to{" "}
              <span className="font-bold">&quot;import addresses from twitter&quot;</span>
            </li>
            <li>Tap the import button, drop your link, and you&apos;re all set.</li>
          </ol>
        </section>
        <section className="mb-6">
          <h4 className="text-md font-bold mb-1">Method two: send to token-holders</h4>
          <p>Here, we&apos;ll send the voting token to anyone who holds a specific token.</p>
          <ol className="list-decimal space-y-1 mt-2 pis-4">
            <li>
              Go to{" "}
              <a rel="nofollow noreferrer" target="_blank" href="https://etherscan.io/" className="link">
                Etherscan
              </a>{" "}
              for eth holders,{" "}
              <a rel="nofollow noreferrer" target="_blank" href="https://polygonscan.com/" className="link">
                Polygonscan
              </a>{" "}
              for polygon holders, or{" "}
              <a href="https://guild.xyz/" rel="nofollow noreferrer" target="_blank" className="link">
                Guild
              </a>{" "}
              for NFT holders.
            </li>
            <li>Type your token address into search</li>
            <li>
              Tap the link next to <span className="font-bold">&quot;token tracker&quot;</span> in{" "}
              <span className="font-bold">&quot;more info&quot;</span>
            </li>
            <li>
              Tap the tab that says <span className="font-bold">&quot;holder&quot;</span>
            </li>
            <li>
              Scroll down to the bottom and tap <span className="font-bold">&quot;download CSV export&quot;</span>
            </li>
            <li>
              Open that file and edit the spreadsheet to have two columns: token addresses on the left, the amount of
              tokens each receives on the right
            </li>
            <li>Save as a CSV and open in an independent app like &quot;Notes&quot;</li>
          </ol>
          <p>
            You&apos;re done! You should see your full list of recipients and the number of tokens each receives,
            separated by a comma. Paste that in!
          </p>
        </section>
        <section>
          <p className="text-md">
            Finally, if you&apos;d rather let your community *claim* the voting token individually, you can use{" "}
            <a
              rel="nofollow noreferrer"
              target="_blank"
              href="https://coinvise.mirror.xyz/e5LrC96xymHILF36-FXoJHABKz8uYkx_k2IUg6C_GPg"
              className="link"
            >
              Coinvise&apos;s claim page
            </a>{" "}
            and just input the addresses of tokens whose holders can claim.
          </p>
        </section>
      </section>
      {/*@ts-ignore */}
      {dataDeployContest?.address && (
        <Link
          className={appearAsNeutralButton}
          target={"_blank"}
          href={{
            pathname: ROUTE_VIEW_CONTEST,
            query: {
              chain: contestDeployedToChain.name.toLowerCase().replace(" ", ""),
              address: dataDeployContest?.address,
            },
          }}
        >
          Go to contest page
        </Link>
      )}
    </div>
  );
};

export default TextInstructions;
