import { chains } from "@config/wagmi";
import { formatNumber } from "@helpers/formatNumber";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;
const etherscanBaseUrl = `https://api.etherscan.io/api`;

export type VoteCalculationMethod = "token" | "token holder";

interface EtherscanApiResponse {
  status: string;
  message: string;
  result: TokenHolder[];
}

interface TokenHolder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

const NFTS_HARD_LIMIT = 400000;
const ERC20_HARD_LIMIT = 1000000;

export async function fetchNftHolders(
  type: "voting" | "submission",
  contractAddress: string,
  chainName: string,
  minTokensRequired: number = 1,
  votesPerUnit: number = 100,
  voteCalculationMethod: string = "token",
): Promise<Record<string, number> | Error> {
  let baseAlchemyAppUrl = chains.filter(chain => chain.name == chainName.toLowerCase())[0].rpcUrls.default.http[0];

  baseAlchemyAppUrl = baseAlchemyAppUrl.replace(/(v2\/).*/, "$1");

  const alchemyAppUrl = `${baseAlchemyAppUrl}${alchemyApiKey}/getOwnersForCollection`;

  let allOwnersData: any[] = [];
  let nextPageKey: string | undefined;

  do {
    const queryParams = new URLSearchParams({
      contractAddress,
      // TODO: make this configurable so we do not fetch token balances in case of per holder calculation method
      withTokenBalances: "true",
    });

    if (nextPageKey) {
      queryParams.append("pageKey", nextPageKey);
    }

    try {
      const response = await fetch(`${alchemyAppUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }

      const data = await response.json();
      const ownersData = data.ownerAddresses || [];

      if (ownersData.length === 0) {
        return new Error("No owners found for the specified collection.");
      }

      allOwnersData.push(...ownersData);

      if (allOwnersData.length > NFTS_HARD_LIMIT) {
        return new Error(
          `NFT collection has more than ${formatNumber(NFTS_HARD_LIMIT)} holders, which is not supported.`,
        );
      }

      nextPageKey = data.pageKey;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      return {};
    }
  } while (nextPageKey);

  const worker = new Worker(new URL("/workers/nftOwnersProcessing", import.meta.url));

  return new Promise((resolve, reject) => {
    worker.onmessage = event => {
      if (event.data.error) {
        reject(new Error(event.data.error));
        worker.terminate();
      } else {
        resolve(event.data);
      }
      worker.terminate();
    };
    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({
      ownersData: allOwnersData,
      votesPerUnit,
      voteCalculationMethod,
      minTokensRequired,
      eventType: type,
    });
  });
}

export async function fetchTokenHolders(
  type: "voting" | "submission",
  contractAddress: string,
  chainName: string,
  minTokensRequired: number = 1,
  votesPerUnit: number = 100,
  voteCalculationMethod: string = "token",
): Promise<Record<string, number> | Error> {
  if (!etherscanApiKey) return new Error("Etherscan API key is not provided.");

  let allTokenHoldersData: TokenHolder[] = [];
  let page = 1;
  const offset = 10000;

  try {
    while (true) {
      const queryParams = new URLSearchParams({
        module: "token",
        action: "tokenholderlist",
        contractaddress: contractAddress,
        page: page.toString(),
        offset: offset.toString(),
        apikey: etherscanApiKey,
      });

      const response = await fetch(`${etherscanBaseUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }

      const data: EtherscanApiResponse = await response.json();
      const tokenHolders = data.result || [];

      if (tokenHolders.length === 0) break;

      allTokenHoldersData.push(...tokenHolders);

      if (allTokenHoldersData.length > ERC20_HARD_LIMIT) {
        return new Error(`This token has more than ${formatNumber(ERC20_HARD_LIMIT)} holders, which is not supported.`);
      }

      page++;
    }
  } catch (error: any) {
    console.error("There was a problem with the ERC20 fetch operation:", error);
    return new Error(error.message);
  }

  const worker = new Worker(new URL("/workers/tokenHoldersProcessing", import.meta.url));

  return new Promise((resolve, reject) => {
    worker.onmessage = event => {
      if (event.data.error) {
        reject(new Error(event.data.error));
        worker.terminate();
      } else {
        resolve(event.data);
      }
      worker.terminate();
    };
    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({
      tokenHolders: allTokenHoldersData,
      votesPerUnit,
      voteCalculationMethod,
      minTokensRequired,
      eventType: type,
    });
  });
}
