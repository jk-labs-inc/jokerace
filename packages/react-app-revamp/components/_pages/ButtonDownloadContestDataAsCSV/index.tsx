import { useEffect } from "react";
import shallow from "zustand/shallow";
import { useExportContestDataToCSV } from "@hooks/useExportContestDataToCSV/useExportContestDataToCSV";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import useContest from "@hooks/useContest";
import { CSV_COLUMNS_HEADERS } from "@config/react-csv/export-contest";
import { CSVLink } from "react-csv";
import button from "@components/Button/styles";
import Button from "@components/Button";
import Loader from "@components/Loader";
import { format } from "date-fns";
export const ButtonDownloadContestDataAsCSV = () => {
  const { fetchProposalsPage } = useContest();
  const {
    hasPaginationProposalsNextPage,
    indexPaginationProposals,
    totalPagesPaginationProposals,
    currentPagePaginationProposals,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      totalPagesPaginationProposals: state.totalPagesPaginationProposals,
      //@ts-ignore
      currentPagePaginationProposals: state.currentPagePaginationProposals,
      //@ts-ignore
      indexPaginationProposals: state.indexPaginationProposals,
      //@ts-ignore
      hasPaginationProposalsNextPage: state.hasPaginationProposalsNextPage,
    }),
    shallow,
  );

  const { stateExportData, formatContestCSVData } = useExportContestDataToCSV();
  useEffect(() => {
    const startDownloading = async () => {
      stateExportData.setLoadingMessage("Loading remaining proposals data...");
      stateExportData.setIsReady(false);
      try {
        if (hasPaginationProposalsNextPage) {
          const loadAllContestData = [];
          for (let i = currentPagePaginationProposals; i < totalPagesPaginationProposals - 1; i++) {
            loadAllContestData.push(
              fetchProposalsPage(i + 1, indexPaginationProposals[i + 1], totalPagesPaginationProposals),
            );
          }
          await Promise.all(loadAllContestData);
        }
        stateExportData.setIsReady(true);
      } catch (e) {
        stateExportData.setIsReady(false);
        console.error(e);
      }
    };
    startDownloading();
  }, []);

  useEffect(() => {
    if (stateExportData.isReady === true) formatContestCSVData();
  }, [stateExportData.isReady]);

  return (
    <>
      {(stateExportData.isLoading || !stateExportData.isReady) && (
        <div className="animate-appear mb-5">
          <Loader scale="component">{stateExportData.loadingMessage}</Loader>
        </div>
      )}
      {stateExportData.isSuccess ? (
        <div className="animate-appear">
          <p className={`font-bold text-sm text-primary-10`}>{stateExportData.loadingMessage}</p>
        </div>
      ) : (
        stateExportData.isError && (
          <div className="animate-appear">
            <p className="text-sm font-bold mb-5 text-negative-10">
              Something went wrong while preparing the data. Please try again.
            </p>

            <Button onClick={async () => await formatContestCSVData()} intent="neutral-outline">
              Try again
            </Button>
          </div>
        )
      )}
      {stateExportData.isSuccess && (
        <div className="mt-6 animate-appear">
          {/* @ts-ignore */}
          <CSVLink
            filename={`jokedao-contest-data-${format(new Date(), "yyyy-MM-dd")}.csv`}
            className={button({ intent: "neutral-outline" })}
            data={stateExportData.csv}
            headers={CSV_COLUMNS_HEADERS}
          >
            Export
          </CSVLink>
        </div>
      )}
    </>
  );
};

export default ButtonDownloadContestDataAsCSV;
