import { FC, ReactNode } from "react";

interface InfoPanelProps {
  title: string;
  image?: string;
  imageAlt?: string;
  imageSize?: {
    width: number;
    height: number;
  };
  heading?: string;
  description?: ReactNode;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

const InfoPanel: FC<InfoPanelProps> = ({
  title,
  image,
  imageAlt = "info image",
  imageSize = {
    width: 280,
    height: 280,
  },
  heading,
  description,
  actionButton,
}) => {
  return (
    <div className="flex flex-col gap-6 md:gap-12">
      <p className="text-[24px] text-neutral-11">{title}</p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          {image && <img src={image} alt={imageAlt} />}
          <div className="flex flex-col gap-4">
            {heading && <p className="text-[20px] text-neutral-11">{heading}</p>}
            {description &&
              (typeof description === "string" ? (
                <p className="text-[16px] text-neutral-11">{description}</p>
              ) : (
                description
              ))}
          </div>
        </div>
        {actionButton && (
          <button
            className="bg-gradient-create text-true-black text-[16px] font-bold rounded-[40px] w-fit px-6 h-8"
            onClick={actionButton.onClick}
          >
            {actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
