import { CONTEST_TITLE_MAX_LENGTH } from "@components/_pages/Create/constants/length";
import DialogModalV4 from "@components/UI/DialogModalV4";
import ImageUpload from "@components/UI/ImageUpload";
import { ACCEPTED_FILE_TYPES } from "@components/UI/ImageUpload/utils";
import { useUploadImageStore } from "@hooks/useUploadImage";
import { FC, useEffect, useState } from "react";
import EditContestNameTextInput from "../TextInput";

interface EditContestNameModalProps {
  contestName: string;
  isOpen: boolean;
  contestImageUrl?: string;
  setIsCloseModal: (isOpen: boolean) => void;
  handleEditContestNameAndImage?: (value: string, imageValue?: string) => void;
}

const EditContestNameModal: FC<EditContestNameModalProps> = ({
  contestName,
  contestImageUrl,
  isOpen,
  setIsCloseModal,
  handleEditContestNameAndImage,
}) => {
  const [inputValue, setInputValue] = useState(contestName);
  const [imageValue, setImageValue] = useState(contestImageUrl);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<{
    upload?: string;
    url?: string;
  }>({});
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploadImage } = useUploadImageStore();

  useEffect(() => {
    setInputValue(contestName);
    setImageValue(contestImageUrl);
  }, [contestName, contestImageUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setError("title cannot be empty");
    } else if (value.length >= CONTEST_TITLE_MAX_LENGTH) {
      setError(`title must not exceed ${CONTEST_TITLE_MAX_LENGTH} characters`);
    } else {
      setError("");
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setError("title cannot be empty");
    } else if (value.length >= CONTEST_TITLE_MAX_LENGTH) {
      setError(`title must not exceed ${CONTEST_TITLE_MAX_LENGTH} characters`);
    } else {
      setError("");
    }
  };

  const handleEditContestNameAndImageClick = (value: string, imageValue?: string) => {
    if (!value.trim() || value.length >= CONTEST_TITLE_MAX_LENGTH) {
      return;
    }

    handleEditContestNameAndImage?.(value, imageValue);
    setIsCloseModal(false);
    setInputValue("");
    setIsNetworkError(false);
    setValidationError({});
    setUploadSuccess(false);
    setImageValue("");
  };

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setValidationError({
        ...validationError,
        upload: "Please upload a valid image/gif file (JPEG, JPG, PNG, JFIF, GIF, or WebP)",
      });
      return false;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      setValidationError({
        ...validationError,
        upload: "File size should be less than 20MB",
      });
      return false;
    }

    setValidationError({
      ...validationError,
      upload: undefined,
    });
    return true;
  };

  const onFileSelectHandler = async (file: File | null) => {
    setIsNetworkError(false);
    setValidationError({});

    if (!file) {
      setImageValue("");
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setIsLoading(true);

    try {
      const imageUrl = await uploadImageToServer(file);

      if (!imageUrl) {
        setIsNetworkError(true);
        setImageValue("");
        return;
      }

      setUploadSuccess(true);
      setImageValue(imageUrl);
    } catch (error) {
      setIsNetworkError(true);
      setImageValue("");
    } finally {
      setIsLoading(false);
    }
  };

  const onUrlSelectHandler = (url: string | null) => {
    if (!url) {
      setValidationError({});
      setImageValue("");
      return;
    }

    try {
      new URL(url);

      const fileExtension = url.split(".").pop()?.toLowerCase();
      const validImageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "jfif"];

      if (!fileExtension || !validImageExtensions.includes(fileExtension)) {
        setValidationError({
          ...validationError,
          url: "URL must point to a valid image file (JPEG, JPG, PNG, JFIF, GIF, or WebP)",
        });
        setImageValue("");
        return;
      }

      setValidationError({});
    } catch (e) {
      setValidationError({
        ...validationError,
        url: "Please enter a valid URL",
      });
      return;
    }

    setImageValue(url);
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={setIsCloseModal}>
      <div className="flex flex-col gap-14 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">edit title and image</p>
          <img
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsCloseModal(false)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <ImageUpload
            initialImageUrl={imageValue}
            validationError={validationError}
            isSuccess={uploadSuccess}
            isLoading={isLoading}
            isNetworkError={isNetworkError}
            onFileSelect={onFileSelectHandler}
            onUrlSelect={onUrlSelectHandler}
          />
          <div className="bg-true-black w-full md:w-[700px] rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
            <div className="bg-secondary-1 w-full rounded-[16px] outline-none p-4">
              <EditContestNameTextInput
                value={inputValue}
                handleTextAreaChange={handleTextAreaChange}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {error && <p className="text-[16px] text-negative-11 font-bold">{error}</p>}
          <button
            className="bg-gradient-purple self-center md:self-start rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
            onClick={() => handleEditContestNameAndImageClick(inputValue, imageValue)}
          >
            save
          </button>
        </div>
      </div>
    </DialogModalV4>
  );
};

export default EditContestNameModal;
