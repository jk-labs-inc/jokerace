import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { Masonry } from "masonic";
import React, { ReactNode, useMemo, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { usePrevious } from "react-use";

interface ListProposalsContainerProps {
  enabledPreview: EntryPreview | null;
  children: ReactNode;
  recalculateKey?: string | number;
}

const TitleContainer = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;

const MasonicCard = ({ data, width }: { data: ReactNode; width: number }) => (
  <div style={{ width }} className="min-h-52">
    {data}
  </div>
);

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

  const itemsCount = childrenArray.length;
  const prevItemsCount = usePrevious(itemsCount);
  const removesCount = useRef(0);

  const gridKeyPostfix = useMemo(() => {
    if (prevItemsCount === undefined) return removesCount.current;

    if (itemsCount < prevItemsCount) {
      removesCount.current += 1;
      return removesCount.current;
    }

    return removesCount.current;
  }, [itemsCount, prevItemsCount]);

  const masonryKey = recalculateKey ? `${recalculateKey}-${gridKeyPostfix}` : `masonry-${gridKeyPostfix}`;

  return (
    <Masonry key={masonryKey} items={childrenArray} columnGutter={16} columnCount={columnCount} render={MasonicCard} />
  );
};

const ListProposalsContainer = ({ enabledPreview, children, recalculateKey }: ListProposalsContainerProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  switch (enabledPreview) {
    case EntryPreview.TITLE:
      return <TitleContainer children={children} />;

    case EntryPreview.IMAGE:
    case EntryPreview.IMAGE_AND_TITLE:
    case EntryPreview.TWEET:
    case EntryPreview.TWEET_AND_TITLE:
      return <MasonicContainer children={children} columnCount={isMobile ? 1 : 2} recalculateKey={recalculateKey} />;

    default:
      return <TitleContainer children={children} />;
  }
};

export default ListProposalsContainer;
