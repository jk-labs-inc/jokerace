import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";

interface TitleParserProps {
  stringArray: string[];
  enabledPreview: EntryPreview | null;
}

const IMG_TITLE_KEY = "JOKERACE_IMG_TITLE";
const TWEET_TITLE_KEY = "JOKERACE_TWEET_TITLE";

const TitleParser = ({ stringArray, enabledPreview }: TitleParserProps) => {
  if (stringArray.length === 0) {
    return null;
  }

  const extractTitle = (): string | null => {
    if (enabledPreview === EntryPreview.IMAGE_AND_TITLE || enabledPreview === EntryPreview.TWEET_AND_TITLE) {
      const params = new URLSearchParams(stringArray[0]);
      return params.get(IMG_TITLE_KEY) || params.get(TWEET_TITLE_KEY);
    }

    return stringArray[0];
  };

  const title = extractTitle();

  if (!title) {
    return null;
  }

  return (
    <div className="bg-gradient-entry-title h-[88px] flex items-center rounded-t-4xl">
      <div className="pl-8 pr-4 py-6">
        <p className="text-[40px] font-bold text-neutral-11 normal-case">“{title}”</p>
      </div>
    </div>
  );
};

export default TitleParser;
