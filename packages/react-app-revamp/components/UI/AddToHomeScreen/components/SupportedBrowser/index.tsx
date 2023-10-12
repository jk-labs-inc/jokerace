import Image from "next/image";
import { FC } from "react";

interface AddToHomeScreenSupportedBrowserProps {
  onClose?: () => void;
}

const AddToHomeScreenSupportedBrowser: FC<AddToHomeScreenSupportedBrowserProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-[24px] font-bold">add to home screen</p>
        <Image src="/modal/modal_close.svg" width={24} height={24} alt="close" onClick={onClose} />
      </div>
      <p className="text-[16px]">
        <span className="normal-case">JokeRace</span> is meant to be used as an app. <br />
        to install, just follow the steps below:
      </p>
      <div className="markdown pl-1">
        <ol className="flex flex-col gap-3">
          <li className="text-[16px]">
            tap the <b>share icon</b>
          </li>
          <li className="text-[16px]">
            tap <b>add to home screen</b>
          </li>
          <li className="text-[16px]">
            open <span className="normal-case">JokeRace</span> from homescreen
          </li>
        </ol>
      </div>
      <p className="text-[16px]">and that’s it!</p>
    </div>
  );
};

export default AddToHomeScreenSupportedBrowser;
