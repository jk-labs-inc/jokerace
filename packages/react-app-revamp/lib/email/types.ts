// these are the template ids for the emails from Brevo
export enum EmailType {
  SignUpConfirmation = 20,
  VotingEmail = 11,
}

export interface VotingEmailParams {
  contest_link: string;
  contest_end_date: string;
}

// create a subset of EmailType that requires parameters
export type EmailTypeWithParams = EmailType.VotingEmail;

export type EmailTypeParams = {
  [EmailType.VotingEmail]: VotingEmailParams;
};
