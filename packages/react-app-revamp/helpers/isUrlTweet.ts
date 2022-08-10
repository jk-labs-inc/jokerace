export function isUrlTweet(str: string) {
  return (
    str.match(/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/) !== null
  );
}
