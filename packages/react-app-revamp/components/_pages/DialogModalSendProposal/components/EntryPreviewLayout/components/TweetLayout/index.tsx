import { FC, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { debounce } from "lodash";
import { twitterRegex } from "@helpers/regex";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import ClipLoader from "react-spinners/ClipLoader";

interface DialogModalSendProposalEntryPreviewTweetLayoutProps {
  onChange?: (value: string) => void;
}

const DialogModalSendProposalEntryPreviewTweetLayout: FC<DialogModalSendProposalEntryPreviewTweetLayoutProps> = ({
  onChange,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkTweet = useCallback(
    debounce(async (url: string) => {
      if (!url) {
        setIsValid(null);
        return;
      }

      setIsLoading(true);
      const match = url.match(twitterRegex);
      if (!match) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      const tweetId = match[2] || match[4]; // get id from either twitter.com or x.com match
      if (!tweetId) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tweet/${tweetId}`);
        setIsValid(response.ok);
      } catch (error) {
        console.error("error checking tweet:", error);
        setIsValid(false);
      }
      setIsLoading(false);
    }, 500),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(value);
    checkTweet(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] font-bold text-neutral-11">tweet</p>
      <div
        className={`bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"} relative`}
      >
        <input
          type="text"
          onChange={handleInputChange}
          className="text-[16px] bg-secondary-1 outline-none rounded-[16px] placeholder-neutral-10 w-full h-12 indent-4 focus:outline-none pr-10"
          placeholder="www.x.com/me/status/18431..."
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading && <ClipLoader size={18} color="#E5E5E5" className="mt-2 mr-1" />}
          {!isLoading && isValid === true && <CheckCircleIcon className="text-positive-11 w-6 h-6 animate-reveal" />}
          {!isLoading && isValid === false && <XCircleIcon className="text-negative-11 w-6 h-6 animate-reveal" />}
        </div>
      </div>
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewTweetLayout;
