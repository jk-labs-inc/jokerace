import { FC } from "react";

const NoVotersPlaceholder: FC = () => {
  return (
    <div className="flex flex-col gap-4 pr-6">
      <p className="text-[16px] text-neutral-11 font-bold italic">no votes yet…</p>
      <ol className="flex flex-col gap-3 list-decimal list-inside text-[16px]">
        <li className="text-neutral-11">👀</li>
        <li className="text-neutral-11">👀</li>
        <li className="text-neutral-11">👀</li>
        <li className="text-neutral-11">👀</li>
        <li className="text-neutral-11">👀</li>
      </ol>
    </div>
  );
};

export default NoVotersPlaceholder;
