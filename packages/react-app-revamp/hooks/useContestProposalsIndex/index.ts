export function useContestProposalsIndex() {
  async function indexProposal(values: any) {
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const config = await import("@config/supabase");
        const supabase = config.supabase;
        const { error } = await supabase.from("proposals").insert([
          {
            created_at: new Date().toISOString(),
            reference: values.id,
            contest_network_name: values.contestNetworkName,
            contest_address: values.contestAddress,
            author_address: values.authorAddress,
            content: values.content,
            is_content_image: values.isContentImage,
          },
        ]);
        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    indexProposal,
  };
}

export default useContestProposalsIndex;
