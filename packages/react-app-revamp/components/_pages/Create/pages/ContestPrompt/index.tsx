import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { createEditorConfig } from "@helpers/createEditorConfig";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import CreateFlowPromptPreview from "../../components/PromptPreview";
import CreateFlowPromptPreviewToggle from "../../components/PromptPreviewToggle";
import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useUploadImageStore } from "@hooks/useUploadImage";

const CreateContestPrompt = () => {
  const { step, prompt, setPrompt, errors } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const onNextStep = useNextStep();
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const title = isMobile ? "description" : "now for the description";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { uploadImage } = useUploadImageStore();

  const editorSummarize = useEditor({
    ...createEditorConfig({
      content: prompt.summarize,
      placeholderText: isMobile
        ? "core team will pick best feature idea"
        : "our core team will vote on $1000 for best feature proposal",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        setPrompt({
          ...prompt,
          summarize: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorSummarize),
  });

  const editorEvaluateVoters = useEditor({
    ...createEditorConfig({
      content: prompt.evaluateVoters,
      placeholderText: isMobile
        ? "pick which will bring the most users"
        : "voters should vote on the feature that will bring the most users",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        setPrompt({
          ...prompt,
          evaluateVoters: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorEvaluateVoters),
  });

  const editorContactDetails = useEditor({
    ...createEditorConfig({
      content: prompt.contactDetails ?? "",
      placeholderText: isMobile
        ? "i’m on telegram: @me"
        : "we have a telegram group for everyone to coordinate at tgexample.com",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        setPrompt({
          ...prompt,
          contactDetails: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorContactDetails),
  });

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setUploadError("Please upload a valid image/gif file (JPEG, JPG, PNG, JFIF, GIF, or WebP)");
      return false;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size should be less than 20MB");
      return false;
    }

    return true;
  };

  const onFileSelectHandler = async (file: File | null) => {
    if (!file) {
      setUploadError("");
      setPrompt({
        ...prompt,
        imageUrl: "",
      });
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    try {
      const imageUrl = await uploadImageToServer(file);

      setUploadSuccess(true);
      setUploadError("");
      setPrompt({
        ...prompt,
        imageUrl: imageUrl,
      });
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid create-contest-prompt mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <div className="flex justify-between w-full md:w-[650px]">
            <p className="text-[24px] text-neutral-11 font-bold">{title}</p>
            <CreateFlowPromptPreviewToggle onClick={() => setIsPreviewOpen(!isPreviewOpen)} />
          </div>
        </div>
        {isPreviewOpen ? (
          <div className="grid gap-12 col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-8 w-full md:w-[650px]">
            <CreateFlowPromptPreview
              summarize={{ content: prompt.summarize, isEmpty: editorSummarize?.isEmpty ?? true }}
              evaluateVoters={{ content: prompt.evaluateVoters, isEmpty: editorEvaluateVoters?.isEmpty ?? true }}
              contactDetails={{ content: prompt.contactDetails ?? "", isEmpty: editorContactDetails?.isEmpty ?? true }}
              imageUrl={prompt.imageUrl}
            />
          </div>
        ) : (
          <div className="grid gap-12 col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-2 w-full">
            <div className="flex bg-true-black z-10 justify-start w-full md:w-[650px] p-1 border-y border-neutral-2">
              <TipTapEditorControls editor={activeEditor ? activeEditor : editorSummarize} />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="text-neutral-11 text-[20px] font-bold">
                  add a pic <span className="font-normal">(optional)</span>
                </p>
                <ImageUpload
                  onFileSelect={onFileSelectHandler}
                  isSuccess={uploadSuccess}
                  initialImageUrl={prompt.imageUrl}
                />
                {uploadError && <p className="text-[12px] text-negative-11 font-bold">{uploadError}</p>}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-neutral-11 text-[20px] font-bold">
                    what’s the best way for players to reach you? <span className="font-normal">(recommended)</span>
                  </p>
                  <div
                    className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
                  >
                    <EditorContent
                      editor={editorContactDetails}
                      className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-14 md:h-20"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-neutral-11 text-[20px] font-bold">summarize the contest, rewards, and voters:</p>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
                    >
                      <EditorContent
                        editor={editorSummarize}
                        className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-52 md:h-36"
                      />
                    </div>

                    {currentStepError?.message.includes("Contest summary") ? (
                      <ErrorMessage error={(currentStepError || { message: "" }).message} />
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-11 font-bold">
                    how should voters evaluate if an entry is <i>good</i> ?
                  </p>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
                    >
                      <EditorContent
                        editor={editorEvaluateVoters}
                        className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-52 md:h-36"
                      />
                    </div>

                    {currentStepError?.message.includes("Voter evaluation") ? (
                      <ErrorMessage error={(currentStepError || { message: "" }).message} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateContestPrompt;
