import { FC } from "react";

interface ReadOnlyBannerProps {
  isReadOnly: boolean;
  isLoading: boolean;
}

const ReadOnlyBanner: FC<ReadOnlyBannerProps> = ({ isReadOnly, isLoading }) => {
  if (!isReadOnly || isLoading) return null;

  return (
    <div className="w-full bg-true-black text-[16px] text-center flex flex-col gap-1 border border-neutral-11 rounded-[10px] py-2 px-4 items-center shadow-timer-container">
      <div className="flex flex-col text-start">
        <p>
          missing environmental variables limit some functionalities to <b>read mode</b>.
        </p>
        <p>
          for more details, visit{" "}
          <a className="text-positive-11" href="https://github.com/jk-labs-inc/jokerace#readme" target="_blank">
            <b>here!</b>
          </a>
        </p>
      </div>
    </div>
  );
};

export default ReadOnlyBanner;
