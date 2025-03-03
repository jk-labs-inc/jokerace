import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { RadioOption } from "components/_pages/Create/components/RadioButtonsGroup";
import CreateRadioButtonsGroup from "components/_pages/Create/components/RadioButtonsGroup";

interface ImageUploadProps {
  step?: number;
  icon?: React.ReactNode;
  isSuccess?: boolean;
  errorMessage?: string;
  initialImageUrl?: string;
  onFileSelect?: (file: File | null) => void;
  onUrlSelect?: (url: string | null) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({
  onFileSelect,
  onUrlSelect,
  step,
  isSuccess,
  initialImageUrl,
  errorMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUrl || null);
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [urlError, setUrlError] = useState<string>("");

  useEffect(() => {
    setSelectedImage(initialImageUrl || null);
  }, [initialImageUrl]);

  const fileUploadIconWidth = 58;
  const fileUploadIconHeight = 34;

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onFileSelect?.(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (urlError) setUrlError("");
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setUrlError("please enter a valid URL");
      return;
    }

    // simple validation - could be enhanced
    if (!imageUrl.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      setUrlError("please enter a valid image URL");
      return;
    }

    setSelectedImage(imageUrl);
    onUrlSelect?.(imageUrl);
  };

  const Icon = useMemo<React.ReactNode>(() => {
    return (
      <img src="/create-flow/csv_upload.png" width={fileUploadIconWidth} height={fileUploadIconHeight} alt="upload" />
    );
  }, [fileUploadIconHeight, fileUploadIconWidth]);

  const borderStyles = errorMessage
    ? "border-negative-11 hover:border-negative-10"
    : isSuccess
      ? "border-positive-11 hover:border-positive-9"
      : isDragOver
        ? "border-neutral-10"
        : "border-neutral-10 hover:border-neutral-11";

  const renderUploadArea = () => (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      className={`relative flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[376px] md:h-36 justify-center items-center border border-neutral-8 hover:border-positive-11 gap-2 py-2 px-10 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out ${borderStyles}`}
    >
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileInput} accept="image/*" />
      <div className="flex flex-col items-center gap-1">
        {Icon}
        <div className="flex flex-col">
          <p className="text-neutral-11 text-[16px] font-bold">drag & drop image</p>
          <span className="text-neutral-11 text-[16px] font-normal text-center">
            or <span className="text-[16px] text-positive-11">browse</span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderUrlInput = () => (
    <div className="flex flex-col gap-2 w-full md:w-[376px]">
      <div className="flex w-full gap-2">
        <input
          ref={urlInputRef}
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          className="flex-1 px-3 py-2 border border-neutral-8 rounded-md text-neutral-12 bg-true-black focus:outline-none focus:border-positive-9"
          placeholder="https://example.com/image.jpg"
        />
        <button
          onClick={handleUrlSubmit}
          className="px-3 py-2 bg-positive-9 hover:bg-positive-10 text-true-black rounded-md transition-colors"
        >
          use
        </button>
      </div>
      {urlError && <p className="text-negative-11 text-xs">{urlError}</p>}
    </div>
  );

  const radioOptions: RadioOption[] = [
    {
      label: "upload from device",
      value: "upload",
    },
    {
      label: "insert image url",
      value: "url",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {selectedImage ? (
        <div
          className={`relative flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[376px] md:h-36 justify-center items-center border border-transparent hover:border-positive-11 gap-2 py-2 px-10 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out ${borderStyles}`}
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
      ) : errorMessage ? (
        <div className="flex flex-col gap-4">
          <p className="text-[12px] text-negative-11 font-bold">{errorMessage}</p>
          <CreateRadioButtonsGroup
            options={radioOptions}
            value={inputMethod}
            onChange={setInputMethod}
            className="mt-2"
          />
          {inputMethod === "upload" ? renderUploadArea() : renderUrlInput()}
        </div>
      ) : (
        renderUploadArea()
      )}
    </div>
  );
};

export default ImageUpload;
