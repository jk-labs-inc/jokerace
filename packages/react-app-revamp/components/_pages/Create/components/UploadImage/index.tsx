import ImageUpload from "@components/UI/ImageUpload";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateGradientTitle from "../GradientTitle";

const CreateUploadImage = () => {
  const { prompt, setPrompt } = useDeployContestStore(state => state);

  const onImageLoadHandler = (imageUrl: string) => {
    setPrompt({
      ...prompt,
      imageUrl: imageUrl,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <CreateGradientTitle additionalInfo="recommended">preview image</CreateGradientTitle>
      <ImageUpload onImageLoad={onImageLoadHandler} initialImageUrl={prompt.imageUrl} />
    </div>
  );
};

export default CreateUploadImage;
