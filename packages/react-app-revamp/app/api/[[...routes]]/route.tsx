/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
/** @jsxImportSource frog/jsx */

import getContestContractVersion from "@helpers/getContestContractVersion";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { formatEther, parseUnits } from "ethers/lib/utils";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import {
  fetchContestInitialData,
  fetchContestSecondaryData,
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
  const { name, creator, anyoneCanSubmit, submissionsOpenDate, submissionsClosedDate } = await fetchContestInitialData(
    abi as Abi,
    chainId,
    address,
  );
  const now = moment();
  const submissionsOpen = moment(submissionsOpenDate);
  const submissionsClose = moment(submissionsClosedDate);

  if (!anyoneCanSubmit) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="sabo" color="neutral" size="32" align="start">
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
            <Text font="lato" color="red" weight="700" size="16" align="center">
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
          <Text font="sabo" color="neutral" size="32" align="start">
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
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="sabo" color="neutral" size="32" align="start">
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
            <Text font="lato" color="neutral" weight="700" size="16" transform="uppercase">
              submissions not open yet!
            </Text>
          </Box>
        </Box>
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
          <Text font="sabo" color="neutral" size="32" align="start">
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
        <Text font="sabo" color="neutral" size="32" align="start">
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
    intents: [<Button>submit an entry</Button>],
  });
});

app.frame("/contest-submission-details", async c => {
  const pathSegments = c.initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);
  const { name, creator, prompt, costToPropose, voteStartDate } = await fetchContestSecondaryData(
    abi as Abi,
    chainId,
    address,
  );
  const [contestType, contestTitle] = prompt.split("|");

  return c.res({
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="sabo" color="neutral" size="32" align="start">
          Jokerace
        </Text>
        <Box
          flexGrow="1"
          alignHorizontal="center"
          alignVertical="center"
          flexDirection="column"
          gap="32"
          justifyContent="center"
        >
          <Box gap="8" justifyContent="center" alignHorizontal="center" alignVertical="center">
            <Box backgroundColor="darkGrey" border="solid" borderRadius="10" padding="8">
              <Text font="lato" color="black" size="14">
                {contestType}
              </Text>
            </Box>

            <Text font="sabo" color="neutral" size="24">
              {name}
            </Text>
            <Text font="lato" color="neutral" size="16">
              by {shortenEthereumAddress(creator)}
            </Text>
          </Box>

          <Box gap="8" justifyContent="center" alignHorizontal="center" alignVertical="center">
            <Text font="lato" color="neutral" size="16">
              {contestTitle}
            </Text>
            <Text font="lato" color="neutral" size="16">
              {formatEther(BigInt(costToPropose))} ETH to submit
            </Text>
            <Text font="lato" color="neutral" size="16">
              submit by {moment(voteStartDate).format("MMMM Do, YYYY, h:mm a")}
            </Text>
          </Box>
        </Box>
      </Box>
    ),
    intents: [
      <TextInput placeholder="describe your submission..." key="inputText" />,
      <Button.Transaction action="/submit-details" target="/submit" key="submit-proposal">
        submit
      </Button.Transaction>,
      <Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>,
    ],
  });
});

app.frame("/submit-details", async c => {
  const { initialPath } = c;
  const pathSegments = initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];

  return c.res({
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="sabo" color="neutral" size="32" align="start">
          Jokerace
        </Text>
        <Box
          flexGrow="1"
          alignHorizontal="center"
          alignVertical="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Text color="green" font="sabo" size="24">
            you submitted a proposal!
          </Text>
        </Box>
      </Box>
    ),
    intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
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
