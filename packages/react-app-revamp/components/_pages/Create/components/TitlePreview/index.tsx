import ContestImage from "@components/_pages/Contest/components/ContestImage";
import GradientText from "@components/UI/GradientText";
import { FC } from "react";

interface CreateFlowTitlePreviewProps {
  title: string;
  imageUrl?: string;
}

const CreateFlowTitlePreview: FC<CreateFlowTitlePreviewProps> = ({ title, imageUrl }) => {
  return (
    <div className="flex flex-col gap-2">
      <GradientText text={title} isStrikethrough={false} />
      <div className="w-full md:w-[768px]">{imageUrl ? <ContestImage imageUrl={imageUrl} /> : null}</div>
    </div>
  );
};

export default CreateFlowTitlePreview;
