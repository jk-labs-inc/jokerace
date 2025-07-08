import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

interface ListProposalsContainerProps {
  enabledPreview: EntryPreview | null;
  children: ReactNode;
}

const ListProposalsContainer = ({ enabledPreview, children }: ListProposalsContainerProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  switch (enabledPreview) {
    case EntryPreview.TITLE:
      return <div className="flex flex-col gap-4">{children}</div>;
    case EntryPreview.IMAGE:
    case EntryPreview.IMAGE_AND_TITLE:
    case EntryPreview.TWEET:
      const childrenArray = React.Children.toArray(children);
      const leftColumn = childrenArray.filter((_, index) => index % 2 === 0);
      const rightColumn = childrenArray.filter((_, index) => index % 2 !== 0);

      if (isMobile) {
        return <div className="flex flex-col gap-4">{children}</div>;
      }

      return (
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            {leftColumn.map((child, index) => (
              <div key={index} className="break-inside-avoid">
                {child}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {rightColumn.map((child, index) => (
              <div key={index} className="break-inside-avoid">
                {child}
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return <div className="flex flex-col gap-8">{children}</div>;
  }
};

export default ListProposalsContainer;
