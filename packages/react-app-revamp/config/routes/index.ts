export const ROUTE_CREATE_CONTEST = "/contest/new";
export const ROUTE_VIEW_CONTESTS = "/contests";
export const ROUTE_VIEW_USER = `/user`;
export const ROUTE_VIEW_LIVE_CONTESTS = `${ROUTE_VIEW_CONTESTS}/live`;
export const ROUTE_VIEW_PAST_CONTESTS = `${ROUTE_VIEW_CONTESTS}/past`;
export const ROUTE_VIEW_UPCOMING_CONTESTS = `${ROUTE_VIEW_CONTESTS}/upcoming`;
export const ROUTE_VIEW_CONTEST_BASE_PATH = "/contest/[chain]/[address]";
export const ROUTE_VIEW_CONTEST = ROUTE_VIEW_CONTEST_BASE_PATH;
export const ROUTE_VIEW_CONTEST_RULES = `${ROUTE_VIEW_CONTEST}/rules`;
export const ROUTE_VIEW_CONTEST_REWARDS = `${ROUTE_VIEW_CONTEST}/rewards`;
export const ROUTE_VIEW_CONTEST_EXPORT_DATA = `${ROUTE_VIEW_CONTEST}/export-data`;
export const ROUTE_CONTEST_PROPOSAL = `${ROUTE_VIEW_CONTEST}/proposal/[proposal]`;
