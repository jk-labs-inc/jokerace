import { EntryPreview } from "@hooks/useDeployContest/store";
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
      const firstColumn = childrenArray.filter((_, index) => index % 3 === 0);
      const secondColumn = childrenArray.filter((_, index) => index % 3 === 1);
      const thirdColumn = childrenArray.filter((_, index) => index % 3 === 2);

      if (isMobile) {
        return <div className="flex flex-col gap-4">{children}</div>;
      }

      return (
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            {firstColumn.map((child, index) => (
              <div key={index} className="break-inside-avoid">
                {child}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {secondColumn.map((child, index) => (
              <div key={index} className="break-inside-avoid">
                {child}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {thirdColumn.map((child, index) => (
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
