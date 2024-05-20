export function shortenEthereumAddress(address: string, version: "normal" | "long" = "normal") {
  if (!address) return "";

  let front, end;
  if (version === "long") {
    front = address.slice(0, 9); // Get first 10 characters for long version
    end = address.slice(-8); // Get last 9 characters for long version
  } else {
    front = address.slice(0, 5); // Get first 5 characters for normal version
    end = address.slice(-4); // Get last 4 characters for normal version
  }

  const mid = "...";
  const shortenedAddress = front + mid + end;
  return shortenedAddress;
}

export default shortenEthereumAddress;
