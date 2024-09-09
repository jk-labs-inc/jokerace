import { load } from "cheerio";
import { twitterRegex } from "./regex";

export interface Tweet {
  isTweet: boolean;
  id: string;
}

export const isContentTweet = (htmlContent: string): Tweet => {
  const $ = load(htmlContent);
  let foundTweet = false;
  let tweetId = "";

  $("a, p").each(function () {
    const element = this.tagName.toLowerCase();
    const content = element === "a" ? $(this).attr("href") : $(this).text();
    const tweetUrlMatch = content && content.match(twitterRegex);

    const isInsideList = $(this).parents("li,ul,ol").length > 0;

    if (!isInsideList && tweetUrlMatch) {
      foundTweet = true;
      tweetId = tweetUrlMatch[4] || tweetUrlMatch[2];
      return false;
    }
  });

  return { isTweet: foundTweet, id: tweetId };
};
