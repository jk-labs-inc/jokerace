export interface SubmissionCriteria {
  user_address: string;
  [key: string]: any;
}

export interface Submission {
  contest_address: string;
  created_at: number;
  network_name: string;
  proposal_id: string;
  vote_amount?: number;
}

export interface Comment {
  contest_address: string;
  created_at: number;
  network_name: string;
  proposal_id: string;
  comment_id: string;
}

export interface Contest {
  title: string;
  address: string;
}

export type SubmissionWithContest = Submission & { contest: Contest };

export type CommentsWithContest = Comment & { contest: Contest };

export interface SubmissionsResult {
  data: Array<Submission & { contest: Contest }>;
  count: number;
}

export interface CommentsResult {
  data: Array<Comment & { contest: Contest }>;
  count: number;
}
