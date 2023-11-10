export function shortenEthereumAddress(address: string) {
  const front = address.slice(0, 5); // Get first 5 characters
  const mid = "...";
  const end = address.slice(-4); // Get last 4 characters
  const shortenedAddress = front + mid + end;
  return shortenedAddress;
}

export default shortenEthereumAddress;
