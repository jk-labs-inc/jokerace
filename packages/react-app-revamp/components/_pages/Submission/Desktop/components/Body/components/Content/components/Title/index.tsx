import { useEntryPreview } from "./hooks/useEntryPreview";
import TitleParser from "./components/TitleParser";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

interface SubmissionPageDesktopBodyContentTitleProps {
  stringArray: string[];
}

const SubmissionPageDesktopBodyContentTitle = ({ stringArray }: SubmissionPageDesktopBodyContentTitleProps) => {
  const { isLoading, isError, isEntryPreviewTitle, enabledPreview } = useEntryPreview();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!isEntryPreviewTitle) {
    return null;
  }

  return <TitleParser stringArray={stringArray} enabledPreview={enabledPreview} />;
};

export default SubmissionPageDesktopBodyContentTitle;
