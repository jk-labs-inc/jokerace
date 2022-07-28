import { supabase } from "@config/supabase";
import { fetchToken, getAccount, getNetwork } from "@wagmi/core";

export function useContestsIndex() {
  async function indexContest(values: any) {
    try {
      const { address } = getAccount();
      //@ts-ignore
      const { chainId } = await getNetwork();
      const tokenRawData = await fetchToken({ address: values.votingTokenAddress, chainId });

      const { error } = await supabase.from("contests").insert([
        {
          created_at: new Date().toISOString(),
          start_at: new Date(values.datetimeOpeningSubmissions).toISOString(),
          vote_start_at: new Date(values.datetimeOpeningVoting).toISOString(),
          end_at: new Date(values.datetimeClosingVoting).toISOString(),
          title: values.contestTitle,
          dao_name: values?.daoName ?? null,
          address: values.contractAddress,
          author_address: values?.authorAddress ?? address,
          token_address: values.votingTokenAddress,
          token_symbol: tokenRawData.symbol,
          network_name: values.networkName,
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    indexContest,
  };
}

export default useContestsIndex;
