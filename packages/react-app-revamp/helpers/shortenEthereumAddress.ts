export function shortenEthereumAddress(address: string) {
  let shortenedAddress = address;
  const shortenedLength = 4;
  const front = address.substr(0, shortenedLength);
  const mid = "...";
  const end = address.substr(-2);
  shortenedAddress = front + mid + end;
  return shortenedAddress;
}

export default shortenEthereumAddress;
