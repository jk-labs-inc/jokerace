export function truncateText(input: string, maxLength: number) {
  if (input.length <= maxLength) return input;

  let truncated = input.substring(0, maxLength);

  // Find the last whitespace character in the truncated string
  let lastWhitespaceIndex = truncated.lastIndexOf(" ");

  // If we found a whitespace character, truncate the string at that index
  if (lastWhitespaceIndex > 0) {
    truncated = truncated.substring(0, lastWhitespaceIndex);
  }

  // Append ellipsis to indicate that the text is truncated
  truncated += "...";

  return truncated;
}
