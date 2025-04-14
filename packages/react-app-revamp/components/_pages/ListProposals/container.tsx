import { EntryPreview } from "@hooks/useDeployContest/store";
import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { Masonry } from "masonic";

interface ListProposalsContainerProps {
  enabledPreview: EntryPreview | null;
  children: ReactNode;
}

const MasonryContainer = ({ children, columnCount }: { children: ReactNode; columnCount: number }) => {
  const childrenArray = React.Children.toArray(children);

  return <Masonry items={childrenArray} columnGutter={16} columnCount={columnCount} render={({ data }) => data} />;
};

const ListProposalsContainer = ({ enabledPreview, children }: ListProposalsContainerProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  switch (enabledPreview) {
    case EntryPreview.TITLE:
      return <MasonryContainer children={children} columnCount={1} />;

    case EntryPreview.IMAGE:
    case EntryPreview.IMAGE_AND_TITLE:
    case EntryPreview.TWEET:
      return <MasonryContainer children={children} columnCount={isMobile ? 1 : 2} />;

    default:
      return <MasonryContainer children={children} columnCount={1} />;
  }
};

export default ListProposalsContainer;
