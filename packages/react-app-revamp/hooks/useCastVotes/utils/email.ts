import { useEmailSend } from "@hooks/useEmailSend";
import { EmailType, VotingEmailParams } from "lib/email/types";

export const createVotingEmailSender = (sendEmail: ReturnType<typeof useEmailSend>["sendEmail"]) => {
  return async (userAddress: string, params: VotingEmailParams) => {
    await sendEmail(userAddress, EmailType.VotingEmail, params);
  };
};
