import { FC } from "react";

interface ProposalLayoutGalleryRankOrPlaceholderProps {
  rank: number;
}

const ProposalLayoutGalleryRankOrPlaceholder: FC<ProposalLayoutGalleryRankOrPlaceholderProps> = ({ rank }) => {
  if (rank === 0) return null;

  if (rank === 1) return <img src="/contest/ranks/first.svg" alt="Rank 1" className="w-10 md:h-10 object-contain" />;

  return (
    <div className="w-6 h-6 bg-true-black bg-opacity-30 rounded-full flex items-center justify-center">
      <p
        className="text-neutral-11 text-center text-[16px] font-bold"
        style={{
          textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
        }}
      >
        {rank}
      </p>
    </div>
  );
};

export default ProposalLayoutGalleryRankOrPlaceholder;
