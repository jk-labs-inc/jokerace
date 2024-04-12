/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
/** @jsxImportSource frog/jsx */

import getContestContractVersion from "@helpers/getContestContractVersion";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { parseUnits } from "ethers/lib/utils";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import {
  fetchContestDataForSubmitProposal,
  fetchCostToPropose,
  safeMetadata,
  targetMetadata,
} from "lib/frames/submission";
import { Box, Text, vars } from "lib/frames/ui";
import { SupportedChainId, getChainId, isSupportedChainId } from "lib/frames/utils";
import { fetchCostToVote, fetchProposalInfo } from "lib/frames/voting";
import moment from "moment";
import { Abi } from "viem";

const isDev = process.env.NODE_ENV === "development";

const URLLink = isDev ? "http://localhost:3000" : "https://jokerace.io";

const app = new Frog({
  basePath: "/api",
  ui: { vars },
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
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="sabo" color="neutral" size="32" alignSelf="flex-start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="sabo" color="neutral" size="24">
                {name}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(creator)}
              </Text>
            </Box>
            <Text font="lato" color="red" weight="700" size="16">
              ruh-roh! it looks like this contest is allowlisted. <br />
              visit jokerace to play!
            </Text>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}`} key="not-supported-chain-contest">
          visit contest
        </Button.Link>,
      ],
    });
  }

  if (!isSupportedChainId(chainId)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="sabo" color="neutral" size="32" alignSelf="flex-start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="sabo" color="neutral" size="24">
                {name}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(creator)}
              </Text>
            </Box>
            <Text font="lato" color="red" weight="700" size="16">
              ruh-roh! it looks like this contest is deployed <br /> on a chain that farcaster does not support! 😢
            </Text>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}`} key="not-supported-chain-contest">
          visit contest
        </Button.Link>,
      ],
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
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}`} key="submission-not-open-contest">
          visit contest
        </Button.Link>,
      ],
    });
  } else if (now.isAfter(submissionsClose)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="sabo" color="neutral" size="32" alignSelf="flex-start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="sabo" color="neutral" size="24">
                {name}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(creator)}
              </Text>
            </Box>
            <Text font="lato" color="red" weight="700" size="16" transform="uppercase">
              submissions closed!
            </Text>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}`} key="not-supported-chain-contest">
          visit contest
        </Button.Link>,
      ],
    });
  }

  return c.res({
    action: "/contest-submission-details",
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="sabo" color="neutral" size="32" alignSelf="flex-start">
          Jokerace
        </Text>
        <Box
          flexGrow="1"
          alignHorizontal="center"
          alignVertical="center"
          flexDirection="column"
          gap="8"
          justifyContent="center"
        >
          <Text font="sabo" color="neutral" size="24">
            {name}
          </Text>
          <Text font="lato" color="neutral" size="16">
            by {shortenEthereumAddress(creator)}
          </Text>
        </Box>
      </Box>
    ),
    intents: [<Button>Let’s submit!</Button>],
  });
});

app.frame("/contest-submission-details", c => {
  return c.res({
    image: (
      <div style={{ color: "black", display: "flex", fontSize: 60 }}>
        <p style={{ color: "white" }}>submit a proposal</p>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your entry" key="inputText" />,
      <Button.Transaction action="/submit-details" target="/submit" key="submit-proposal">
        Submit
      </Button.Transaction>,
    ],
  });
});

app.frame("/submit-details", c => {
  const { transactionId, initialPath } = c;

  return c.res({
    image: (
      <div tw="flex flex-col h-full bg-slate-500">
        <div tw="text-white text-6xl">tx: {transactionId}</div>
        <div tw="text-white text-6xl">{initialPath}</div>
      </div>
    ),
  });
});

app.transaction("/submit", async c => {
  const { inputText: proposalContent } = c;
  const pathSegments = c.initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];

  const userAddress = c.address;

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
    action: "/contest-vote-details",
    image: (
      <div tw="flex flex-col h-full bg-black p-4">
        <div tw="text-neutral-300 text-4xl uppercase">{submission}</div>
      </div>
    ),
    intents: [<Button>Let's vote!</Button>],
  });

  // return c.res({
  //   image: (
  //     <div tw="flex flex-col h-full bg-slate-500">
  //       <div tw="text-primary-11 text-6xl">Proposal: {content}</div>
  //     </div>
  //   ),
  //   intents: [
  //     <TextInput placeholder="0 votes" key={`${id}`} />,
  //     <Button.Transaction target={`/vote/${chain}/${address}/${submission}`} key={`vote-${id}`}>
  //       vote
  //     </Button.Transaction>,
  //     <Button.Link href={`${URL}/contest/${chain}/${address}`} key="visit-submission">
  //       visit submission
  //     </Button.Link>,
  //   ],
  // });
});

app.frame("/contest-vote-details", c => {
  return c.res({
    image: (
      <div style={{ color: "black", display: "flex", fontSize: 60 }}>
        <p style={{ color: "white" }}>submit a proposal</p>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your proposal" key="inputText" />,
      <Button.Transaction target="/vote" key="submit-proposal">
        Submit Proposal
      </Button.Transaction>,
    ],
  });
});

app.transaction("/vote", async c => {
  const { inputText: amountOfVotesToCast } = c;
  const pathSegments = c.initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const submission = pathSegments[6];

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
