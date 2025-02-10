import CreateGradientTitle from "@components/_pages/Create/components/GradientTitle";
import CreateTextInput from "@components/_pages/Create/components/TextInput";
import CreateUploadImage from "@components/_pages/Create/components/UploadImage";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "@components/_pages/Create/constants/length";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const CreateContestRulesTitleAndImage = () => {
  const { title, setTitle } = useDeployContestStore(state => state);

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  return (
    <div className="flex flex-col gap-8">
      <CreateUploadImage />

      <div className="flex flex-col gap-2">
        <CreateGradientTitle additionalInfo="required">contest title</CreateGradientTitle>
        <CreateTextInput
          className="w-full md:w-[600px] text-[20px]"
          value={title}
          placeholder="eg. gitcoin bounty for devs"
          minLength={CONTEST_TITLE_MIN_LENGTH}
          maxLength={CONTEST_TITLE_MAX_LENGTH}
          onChange={value => handleTitleChange(value)}
        />
        <CreateGradientTitle textSize="small">
          {title.length}/{CONTEST_TITLE_MAX_LENGTH} characters
        </CreateGradientTitle>
      </div>
    </div>
  );
};

export default CreateContestRulesTitleAndImage;
