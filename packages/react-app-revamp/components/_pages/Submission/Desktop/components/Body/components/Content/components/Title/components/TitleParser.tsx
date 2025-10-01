import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";

interface TitleParserProps {
  stringArray: string[];
  enabledPreview: EntryPreview | null;
}

const TitleParser = ({ stringArray, enabledPreview }: TitleParserProps) => {
  if (stringArray.length === 0) {
    return null;
  }

  const extractTitle = (): string | null => {
    if (enabledPreview === EntryPreview.IMAGE_AND_TITLE) {
      const params = new URLSearchParams(stringArray[0]);
      return params.get("JOKERACE_IMG_TITLE");
    }

    return stringArray[0];
  };

  const title = extractTitle();

  if (!title) {
    return null;
  }

  return (
    <div className="bg-gradient-entry-title rounded-t-4xl">
      <div className="pl-8 pr-4 py-6">
        <p className="text-[40px] font-bold text-neutral-11 normal-case">“{title}”</p>
      </div>
    </div>
  );
};

export default TitleParser;
