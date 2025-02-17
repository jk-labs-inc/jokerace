export enum EmailType {
  SignUpConfirmation = "signup-confirmation",
  VotingEmail = "voting-email",
  EntryEmail = "entry-email",
}

export interface VotingEmailParams {
  contest_link: string;
  contest_end_date: string;
}

export interface EntryEmailParams {
  contest_voting_open_date: string;
  contest_end_date: string;
}

// create a subset of EmailType that requires parameters
export type EmailTypeWithParams = EmailType.VotingEmail | EmailType.EntryEmail;

export type EmailTypeParams = {
  [K in EmailTypeWithParams]: K extends EmailType.VotingEmail ? VotingEmailParams : EntryEmailParams;
};

export interface EmailRecipient {
  email: string;
  name?: string;
}
