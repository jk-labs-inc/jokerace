/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import getContestContractVersion from "@helpers/getContestContractVersion";
import { parseUnits } from "ethers/lib/utils";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import {
  fetchContestDataForSubmitProposal,
  fetchCostToPropose,
  safeMetadata,
  targetMetadata,
} from "lib/frames/submission";
import { Box, Heading, vars } from "lib/frames/ui";
import { SupportedChainId, getChainId, isSupportedChainId } from "lib/frames/utils";
import { fetchCostToVote, fetchProposalInfo } from "lib/frames/voting";
import moment from "moment";
import { Abi } from "viem";

const URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://jokerace.io";

const app = new Frog({
  basePath: "/api",
  browserLocation: "/:path",
  ui: { vars },
  imageOptions: {
    format: "png",
  },
  origin: "https://",
});

// Submit proposal
app.frame("/contest/:chain/:address", async c => {
  const { chain, address } = c.req.param();
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);
  const { name, creator, anyoneCanSubmit, submissionsOpenDate, submissionsClosedDate } =
    await fetchContestDataForSubmitProposal(abi as Abi, chainId, address);
  const now = moment();
  const submissionsOpen = moment(submissionsOpenDate);
  const submissionsClose = moment(submissionsClosedDate);

  if (!anyoneCanSubmit) {
    return c.res({
      image: (
        <div tw="flex flex-col h-full bg-slate-500">
          <div tw="text-primary-11 text-6xl">{name}</div>
          <div tw="text-primary-11 text-6xl">{creator}</div>
        </div>
      ),
      intents: [<Button.Redirect location={`${URL}/contest/${chain}/${address}`}>visit contest</Button.Redirect>],
    });
  }

  if (!isSupportedChainId(chainId)) {
    return c.res({
      image: (
        <Box grow backgroundColor="black" padding="16">
          <Heading color="white">JokeRace</Heading>
        </Box>
      ),
      intents: [<Button.Redirect location={`${URL}/contest/${chain}/${address}`}>visit contest</Button.Redirect>],
    });
  }

  if (now.isBefore(submissionsOpen)) {
    return c.res({
      image: (
        <div tw="flex flex-col h-full bg-slate-500">
          <div tw="text-primary-11 text-6xl">Submissions aren't open yet.</div>
          <div tw="text-primary-11 text-6xl">{`Opens on: ${submissionsOpen.format("MMMM Do YYYY, h:mm:ss a")}`}</div>
        </div>
      ),
      intents: [<Button.Redirect location={`${URL}/contest/${chain}/${address}`}>visit contest</Button.Redirect>],
    });
  } else if (now.isAfter(submissionsClose)) {
    return c.res({
      image: (
        <div tw="flex flex-col h-full bg-slate-500">
          <div tw="text-primary-11 text-6xl">Submissions are closed.</div>
          <div tw="text-primary-11 text-6xl">{`Closed on: ${submissionsClose.format("MMMM Do YYYY, h:mm:ss a")}`}</div>
        </div>
      ),
      intents: [<Button.Redirect location={`${URL}/contest/${chain}/${address}`}>visit contest</Button.Redirect>],
    });
  }

  return c.res({
    image: (
      <div tw="flex flex-col h-full bg-slate-500">
        <div tw="text-primary-11 text-6xl">{name}</div>
      </div>
    ),
    intents: [
      <TextInput placeholder="your submission goes here..." />,
      <Button.Transaction action={`/submit-proposal`} target={`/submit-proposal/${chain}/${address}`}>
        submit
      </Button.Transaction>,
      <Button.Redirect location={`${URL}/contest/${chain}/${address}`}>visit contest</Button.Redirect>,
    ],
  });
});

app.frame("/submit-proposal", c => {
  return c.res({
    image: <div style={{ color: "black", display: "flex", fontSize: 20 }}>Tx Details</div>,
  });
});

app.transaction("/submit-proposal/:chain/:address", async c => {
  const { inputText: proposalContent } = c;
  const userAddress = c.address;
  const { chain, address } = c.req.param();

  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);
  const costToPropose = await fetchCostToPropose(abi as Abi, chainId, address);

  let proposalCore = {
    author: userAddress,
    exists: true,
    description: proposalContent,
    targetMetadata: targetMetadata,
    safeMetadata: safeMetadata,
  };

  return c.contract({
    abi: abi as unknown as Abi,
    chainId: `eip155:${chainId as SupportedChainId}`,
    to: address as `0x${string}`,
    functionName: "propose",
    args: [proposalCore, []],
    value: costToPropose,
  });
});

// Vote on a proposal
app.frame("/contest/:chain/:address/submission/:submission", async c => {
  const { chain, address, submission } = c.req.param();
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);

  const { id, rank, votes, isTied, authorEthereumAddress, content, exists } = await fetchProposalInfo(
    abi as Abi,
    address,
    chainId,
    submission,
  );

  return c.res({
    image: (
      <div tw="flex flex-col h-full bg-slate-500">
        <div tw="text-primary-11 text-6xl">Proposal: {content}</div>
      </div>
    ),
    intents: [
      <TextInput placeholder="0 votes" />,
      <Button.Transaction target={`/vote/${chain}/${address}/${submission}`}>vote</Button.Transaction>,
      <Button.Redirect location={`${URL}/contest/${chain}/${address}`}>visit submission</Button.Redirect>,
    ],
  });
});

app.transaction("/vote/:chain/:address/:submission", async c => {
  const { inputText: amountOfVotesToCast } = c;
  const { chain, address, submission } = c.req.param();

  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);

  const costToVote = await fetchCostToVote(abi as Abi, chainId, address, Number(amountOfVotesToCast));

  return c.contract({
    abi: abi as unknown as Abi,
    chainId: `eip155:${chainId as SupportedChainId}`,
    to: address as `0x${string}`,
    functionName: "castVote",
    args: [submission, 0, 0, parseUnits(amountOfVotesToCast?.toString() ?? ""), []],
    value: costToVote,
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
