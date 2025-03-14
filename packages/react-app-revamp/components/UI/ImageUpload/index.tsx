import CreateTextInput from "@components/_pages/Create/components/TextInput";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUploadImageStore } from "@hooks/useUploadImage";
import CreateRadioButtonsGroup, {
  RadioButtonsLabelFontSize,
  RadioOption,
} from "components/_pages/Create/components/RadioButtonsGroup";
import React, { FC, useEffect, useRef, useState } from "react";
import { ACCEPTED_FILE_TYPES } from "./utils";

interface ImageUploadProps {
  initialImageUrl?: string;
  onImageLoad?: (imageUrl: string) => void;
}

const fileUploadIconWidth = 58;
const fileUploadIconHeight = 34;

const ImageUpload: FC<ImageUploadProps> = ({ initialImageUrl, onImageLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUrl || null);
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<{
    upload?: string;
    url?: string;
  }>({});
  const { uploadImage } = useUploadImageStore();

  useEffect(() => {
    if (validationError?.upload) {
      setSelectedImage(null);
    }
    setSelectedImage(initialImageUrl || null);
  }, [initialImageUrl, validationError?.upload]);

  useEffect(() => {
    if (isNetworkError) {
      setSelectedImage(null);
    }
  }, [isNetworkError]);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setValidationError({
        ...validationError,
        upload: "please upload a valid image/gif file (JPEG, JPG, PNG, JFIF, GIF, or WebP)",
      });
      return false;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      setValidationError({
        ...validationError,
        upload: "file size should be less than 20MB",
      });
      return false;
    }

    setValidationError({
      ...validationError,
      upload: undefined,
    });
    return true;
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const img = await uploadImage(file);
    return img ?? "";
  };

  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (validateFile(file)) {
        await processFileUpload(file);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFileUpload = async (file: File) => {
    setIsNetworkError(false);
    setValidationError({});
    setIsLoading(true);

    try {
      const imageUrl = await uploadImageToServer(file);

      if (!imageUrl) {
        setIsNetworkError(true);
        setSelectedImage(null);
        onImageLoad?.("");
        return;
      }

      setSelectedImage(imageUrl);
      onImageLoad?.(imageUrl);
    } catch (error) {
      setIsNetworkError(true);
      setSelectedImage(null);
      onImageLoad?.("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (validateFile(file)) {
        await processFileUpload(file);
      }
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    onImageLoad?.("");
  };

  const handleUrlChange = (value: string) => {
    setImageUrl(value);

    if (validationError?.url) {
      setValidationError({
        ...validationError,
        url: undefined,
      });
    }

    if (!value) {
      setSelectedImage(null);
      onImageLoad?.("");
      return;
    }

    if (validateUrl(value)) {
      setSelectedImage(value);
      onImageLoad?.(value);
      setIsNetworkError(false);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);

      const fileExtension = url.split(".").pop()?.toLowerCase();
      const validImageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "jfif"];

      if (!fileExtension || !validImageExtensions.includes(fileExtension)) {
        setValidationError({
          ...validationError,
          url: "url must point to a valid image file (JPEG, JPG, PNG, JFIF, GIF, or WebP)",
        });
        return false;
      }

      return true;
    } catch (e) {
      setValidationError({
        ...validationError,
        url: "please enter a valid URL",
      });
      return false;
    }
  };

  const renderUploadArea = () => (
    <div className="flex flex-col gap-2">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        className={`relative flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[376px] md:h-36 justify-center items-center border ${
          validationError?.upload ? "border-negative-11" : "border-transparent hover:border-positive-11"
        } gap-2 py-2 px-10 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out`}
      >
        <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileInput} accept="image/*" />
        <div className="flex flex-col items-center gap-1">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-t-2 border-positive-11 rounded-full animate-spin"></div>
              <p className="text-neutral-11 text-[16px] font-bold">uploading...</p>
            </div>
          ) : (
            <>
              <img
                src="/create-flow/csv_upload.png"
                width={fileUploadIconWidth}
                height={fileUploadIconHeight}
                alt="upload"
              />
              <div className="flex flex-col">
                <p className="text-neutral-11 text-[16px] font-bold">drag & drop image</p>
                <span className="text-neutral-11 text-[16px] font-normal text-center">
                  or <span className="text-[16px] text-positive-11">browse</span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      {validationError?.upload && (
        <p className="text-negative-11 text-[16px] font-bold mt-1">{validationError.upload}</p>
      )}
    </div>
  );

  const renderUrlInput = () => (
    <div className="flex flex-col gap-2 w-full md:w-[376px]">
      <CreateTextInput value={imageUrl} onChange={handleUrlChange} placeholder="https://i.imgur.com/example.jpg" />
      {validationError?.url && <p className="text-negative-11 text-[16px] font-bold">{validationError.url}</p>}
    </div>
  );

  const networkErrorRadioOptions: RadioOption[] = [
    {
      label: "try to upload again",
      value: "upload",
      content: renderUploadArea(),
    },
    {
      label: "insert image URL",
      value: "url",
      content: renderUrlInput(),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {selectedImage && !isLoading ? (
        <div
          className={`relative flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[376px] md:h-36 justify-center items-center border border-transparent hover:border-positive-11 gap-2 py-2 px-10 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out`}
          style={{
            backgroundImage: `url(${selectedImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-true-black rounded-full p-1 shadow-md hover:bg-neutral-3 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-neutral-11" />
          </button>
        </div>
      ) : isNetworkError ? (
        <div className="flex flex-col gap-4">
          <CreateRadioButtonsGroup
            options={networkErrorRadioOptions}
            value={inputMethod}
            onChange={setInputMethod}
            className="mt-2"
            labelFontSize={RadioButtonsLabelFontSize.SMALL}
          />
        </div>
      ) : (
        renderUploadArea()
      )}
    </div>
  );
};

export default ImageUpload;
