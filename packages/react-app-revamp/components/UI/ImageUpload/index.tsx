import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { RadioButtonsLabelFontSize, RadioOption } from "components/_pages/Create/components/RadioButtonsGroup";
import CreateRadioButtonsGroup from "components/_pages/Create/components/RadioButtonsGroup";
import CreateTextInput from "@components/_pages/Create/components/TextInput";

interface ImageUploadProps {
  icon?: React.ReactNode;
  isLoading?: boolean;
  validationError?: {
    upload?: string;
    url?: string;
  };
  isNetworkError?: boolean;
  initialImageUrl?: string;
  onFileSelect?: (file: File | null) => void;
  onUrlSelect?: (url: string | null) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({
  onFileSelect,
  onUrlSelect,
  isLoading,
  initialImageUrl,
  validationError,
  isNetworkError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUrl || null);
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (validationError?.upload) {
      setSelectedImage(null);
    }
    setSelectedImage(initialImageUrl || null);
  }, [initialImageUrl]);

  useEffect(() => {
    if (isNetworkError) {
      setSelectedImage(null);
    }
  }, [isNetworkError]);

  const fileUploadIconWidth = 58;
  const fileUploadIconHeight = 34;

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onFileSelect?.(file);

      // Only set the preview image if we're not in loading state
      if (!isLoading) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    // reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      onFileSelect?.(file);

      // Only set the preview image if we're not in loading state
      if (!isLoading) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    setIsDragOver(false);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    onFileSelect?.(null);
  };

  const handleUrlChange = (value: string) => {
    setImageUrl(value);
    if (validationError?.url) validationError.url = "";

    // Only pass the URL to the parent component, but don't clear the network error state
    if (onUrlSelect) {
      onUrlSelect(value || null);
    }
  };

  const Icon = useMemo<React.ReactNode>(() => {
    return (
      <img src="/create-flow/csv_upload.png" width={fileUploadIconWidth} height={fileUploadIconHeight} alt="upload" />
    );
  }, [fileUploadIconHeight, fileUploadIconWidth]);

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
              {Icon}
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
      label: "keep trying to upload",
      value: "upload",
      content: renderUploadArea(),
    },
    {
      label: "insert image url",
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
