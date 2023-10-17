export function containsTweetUrl(str: string) {
  return (
    str.match(/https?:\/\/((twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+))|(x\.com\/\w+\/status\/\d+))(\?\S+)?/) !==
    null
  );
}

export function extractTwitterUrlFromHTML(html: string): string | null {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const textContent = doc.body.textContent || "";

  const match = textContent.match(
    /https?:\/\/((twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+))|(x\.com\/\w+\/status\/\d+))(\?\S+)?/,
  );

  return match ? match[0] : null;
}
