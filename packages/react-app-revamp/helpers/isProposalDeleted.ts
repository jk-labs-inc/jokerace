export function isProposalDeleted(proposalContent: string): boolean {
 return "This proposal has been deleted by the creator of the contest." === proposalContent
}

export default isProposalDeleted