export function extractPathSegments(url: string) {
  const [path] = url.split("?");

  const segments = path.split("/");

  return {
    chainName: segments[2],
    address: segments[3],
  };
}
