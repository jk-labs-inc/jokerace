import { Submitter } from "lib/merkletree/generateSubmissionsTree";

export function useContestSubmissionIndexV3() {
  const indexContestSubmissionV3 = async (address: string, submitters: Submitter[]) => {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      const data = submitters.map(submitter => ({
        address: address,
        submitter: submitter.address,
        can_submit: true,
      }));

      const { error } = await supabase.from("contest_submitters_v3").insert(data);

      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { indexContestSubmissionV3 };
}
