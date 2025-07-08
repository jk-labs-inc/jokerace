import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { Masonry } from "masonic";
import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

interface ListProposalsContainerProps {
  enabledPreview: EntryPreview | null;
  children: ReactNode;
  recalculateKey?: string | number; // Add this prop to force re-render
}

const MasonicCard = ({ data, width }: { data: ReactNode; width: number }) => <div style={{ width }}>{data}</div>;

const MasonicContainer = ({
  children,
  columnCount,
  recalculateKey,
}: {
  children: ReactNode;
  columnCount: number;
  recalculateKey?: string | number;
}) => {
  const childrenArray = React.Children.toArray(children);
  return (
    <Masonry
      key={recalculateKey}
      items={childrenArray}
      columnGutter={16}
      columnCount={columnCount}
      render={MasonicCard}
    />
  );
};

const ListProposalsContainer = ({ enabledPreview, children, recalculateKey }: ListProposalsContainerProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  switch (enabledPreview) {
    case EntryPreview.TITLE:
      return <MasonicContainer children={children} columnCount={1} recalculateKey={recalculateKey} />;

    case EntryPreview.IMAGE:
    case EntryPreview.IMAGE_AND_TITLE:
    case EntryPreview.TWEET:
      return <MasonicContainer children={children} columnCount={isMobile ? 1 : 2} recalculateKey={recalculateKey} />;

    default:
      return <MasonicContainer children={children} columnCount={1} recalculateKey={recalculateKey} />;
  }
};

export default ListProposalsContainer;
