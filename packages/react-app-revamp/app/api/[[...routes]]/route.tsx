/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
/** @jsxImportSource frog/jsx */
import { chains } from "@config/wagmi/server";
import { formatNumber } from "@helpers/formatNumber";
import getContestContractVersion from "@helpers/getContestContractVersion";
import ordinalize from "@helpers/ordinalize";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { shortenProposalId } from "@helpers/shortenProposalId";
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
import { fetchContestInfo, fetchCostToVote, fetchProposalInfo } from "lib/frames/voting";
import moment from "moment";
import { Abi } from "viem";

const isDev = process.env.NODE_ENV === "development";

const URLLink = isDev ? "http://localhost:3000" : "https://jokerace.io";

const app = new Frog({
  basePath: "/api",
  ui: { vars },
  verify: false,
  imageOptions: {
    format: "png",
  },
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
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                {name}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(creator)}
              </Text>
            </Box>
            <Box flexDirection="column" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="4">
              <Text font="lato" color="red" weight="700" size="16">
                ruh-roh! it looks like this contest is allowlisted.
              </Text>
              <Text font="lato" color="red" weight="700" size="16">
                visit jokerace to play!
              </Text>
            </Box>
          </Box>
        </Box>
      ),
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  if (!isSupportedChainId(chainId)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                {name}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(creator)}
              </Text>
            </Box>
            <Box flexDirection="column" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="4">
              <Text font="lato" color="red" weight="700" size="16">
                ruh-roh! it looks like farcaster does not support this chain.
              </Text>
              <Text font="lato" color="red" weight="700" size="16">
                visit jokerace to play!
              </Text>
            </Box>
          </Box>
        </Box>
      ),
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  if (now.isBefore(submissionsOpen)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
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
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  } else if (now.isAfter(submissionsClose)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
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
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  return c.res({
    action: "/submission-details",
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
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
          <Text font="orbitron" transform="uppercase" color="neutral" size="24">
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

app.frame("/submission-details", async c => {
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
  const nativeCurrency = chains.find(c => c.id === chainId)?.nativeCurrency;
  const [contestType, contestTitle] = prompt.split("|");

  return c.res({
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
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

            <Text font="orbitron" transform="uppercase" color="neutral" size="24">
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
              {formatEther(BigInt(costToPropose))} {nativeCurrency?.symbol} to submit
            </Text>
            <Text font="lato" color="neutral" size="16">
              submit by {moment(voteStartDate).format("MMMM Do, YYYY, h:mm a")}
            </Text>
          </Box>
        </Box>
      </Box>
    ),
    intents: [
      <TextInput placeholder="describe your submission..." />,
      <Button.Transaction action="/submit-details" target="/submit">
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
        <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
          Jokerace
        </Text>
        <Box
          flexGrow="1"
          alignHorizontal="center"
          alignVertical="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Text font="orbitron" transform="uppercase" color="green" size="24">
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

  const { anyoneCanVote, contestDeadline, isDeleted, voteStartDate, proposalAuthor } = await fetchContestInfo(
    abi as Abi,
    address,
    chainId,
    submission,
  );

  if (!anyoneCanVote) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                submission {shortenProposalId(submission)}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(proposalAuthor)}
              </Text>
            </Box>
            <Box flexDirection="column" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="4">
              <Text font="lato" color="red" weight="700" size="16">
                ruh-roh! it looks like voting for this contest is allowlisted.
              </Text>
              <Text font="lato" color="red" weight="700" size="16">
                visit jokerace to play!
              </Text>
            </Box>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (!isSupportedChainId(chainId)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                submission {shortenProposalId(submission)}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(proposalAuthor)}
              </Text>
            </Box>
            <Box flexDirection="column" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="4">
              <Text font="lato" color="red" weight="700" size="16">
                ruh-roh! it looks like farcaster does not support this chain.
              </Text>
              <Text font="lato" color="red" weight="700" size="16">
                visit jokerace to play!
              </Text>
            </Box>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (isDeleted) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                submission {shortenProposalId(submission)}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(proposalAuthor)}
              </Text>
            </Box>
            <Text font="lato" color="red" weight="700" size="16" transform="uppercase">
              submission deleted!
            </Text>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (moment().isAfter(contestDeadline)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                submission {shortenProposalId(submission)}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(proposalAuthor)}
              </Text>
            </Box>
            <Text font="lato" color="red" weight="700" size="16" transform="uppercase">
              contest closed!
            </Text>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (moment().isBefore(voteStartDate)) {
    return c.res({
      image: (
        <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
          <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
            Jokerace
          </Text>
          <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
            <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
              <Text font="orbitron" transform="uppercase" color="neutral" size="24">
                submission {shortenProposalId(submission)}
              </Text>
              <Text font="lato" color="neutral" size="16">
                by {shortenEthereumAddress(proposalAuthor)}
              </Text>
            </Box>
            <Text font="lato" color="neutral" weight="700" size="16" transform="uppercase">
              voting not open yet!
            </Text>
          </Box>
        </Box>
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  return c.res({
    action: "/vote-page",
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
          Jokerace
        </Text>
        <Box flexGrow="1" alignHorizontal="center" alignVertical="center" justifyContent="center" gap="32">
          <Box flexDirection="column" gap="8" alignHorizontal="center" alignVertical="center" justifyContent="center">
            <Text font="orbitron" transform="uppercase" color="neutral" size="24">
              submission {shortenProposalId(submission)}
            </Text>
            <Text font="lato" color="neutral" size="16">
              by {shortenEthereumAddress(proposalAuthor)}
            </Text>
          </Box>
        </Box>
      </Box>
    ),
    intents: [<Button>let’s vote!</Button>],
  });
});

app.frame("/vote-page", async c => {
  const { initialPath } = c;
  const pathSegments = initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const submission = pathSegments[6];
  const chainId = getChainId(chain);
  const nativeCurrency = chains.find(c => c.id === chainId)?.nativeCurrency;
  const { abi } = await getContestContractVersion(address, chainId);

  const { name, authorEthereumAddress, content, isTied, rank, votes, costToVote, contestDeadline } =
    await fetchProposalInfo(abi as Abi, address, chainId, submission);

  return c.res({
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
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
            {votes > 0 ? (
              <Box flexDirection="row" gap="4">
                <Text font="lato" color="neutral" size="16" weight="700">
                  {ordinalize(rank).label} place {isTied ? "(tied)" : ""}
                </Text>
                <Text color="neutral">&#8226;</Text>
                <Text font="lato" color="neutral" size="16" weight="700">
                  {formatNumber(votes)} vote{votes > 1 ? "s" : ""}
                </Text>
              </Box>
            ) : (
              <Box />
            )}

            <Text font="orbitron" transform="uppercase" color="neutral" size="24">
              submission {shortenProposalId(submission)}
            </Text>
            <Text font="lato" color="neutral" size="16">
              by {shortenEthereumAddress(authorEthereumAddress)}
            </Text>
          </Box>

          <Box gap="8" justifyContent="center" alignHorizontal="center" alignVertical="center">
            <Text font="lato" color="neutral" size="16">
              {name} contest
            </Text>
            <Text font="lato" color="neutral" size="16">
              1 vote = {formatEther(BigInt(costToVote))} {nativeCurrency?.symbol}
            </Text>
            <Text font="lato" color="neutral" size="16">
              vote by {moment(contestDeadline).format("MMMM Do, YYYY, h:mm a")}
            </Text>
          </Box>

          <Text font="lato" color="neutral" size="14">
            note: use whole numbers only, no decimals.
          </Text>
        </Box>
      </Box>
    ),
    intents: [
      <TextInput placeholder="add votes..." />,
      <Button.Transaction action="/vote-details" target="/vote">
        vote
      </Button.Transaction>,
      <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
        see submission
      </Button.Link>,
    ],
  });
});

app.frame("/vote-details", async c => {
  const { initialPath } = c;
  const pathSegments = initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const submission = pathSegments[6];

  return c.res({
    image: (
      <Box flexDirection="column" grow backgroundColor="black" padding="16" justifyContent="space-between">
        <Text font="orbitron" transform="uppercase" color="neutral" size="32" align="start">
          Jokerace
        </Text>
        <Box
          flexGrow="1"
          alignHorizontal="center"
          alignVertical="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Text font="orbitron" transform="uppercase" color="green" size="24">
            you voted on a proposal!
          </Text>
        </Box>
      </Box>
    ),
    intents: [
      <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
        see submission
      </Button.Link>,
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
