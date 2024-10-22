import { EntryPreview } from "@hooks/useDeployContest/store";

interface ListProposalsContainerProps {
  enabledPreview: EntryPreview | null;
  children: React.ReactNode;
}

const ListProposalsContainer = ({ enabledPreview, children }: ListProposalsContainerProps) => {
  switch (enabledPreview) {
    case EntryPreview.TITLE:
      return <div className="flex flex-col gap-4">{children}</div>;
    case EntryPreview.IMAGE:
    case EntryPreview.TWEET:
      return <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-4">{children}</div>;
    default:
      return <div className="flex flex-col gap-8">{children}</div>;
  }
};

export default ListProposalsContainer;
