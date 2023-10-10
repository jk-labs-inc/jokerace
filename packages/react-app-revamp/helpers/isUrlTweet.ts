export function isUrlTweet(str: string) {
  return (
    str.match(
      /^https?:\/\/((twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+))|(x\.com\/\w+\/status\/\d+))(\?\S+)?$/,
    ) !== null
  );
}
