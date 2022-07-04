import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { useExportContestDataToCSV } from "@hooks/useExportContestDataToCSV/useExportContestDataToCSV";
import { useRouter } from "next/router";
import useContest from "@hooks/useContest";
import { CSV_COLUMNS_HEADERS } from "@config/react-csv/export-contest";
import { CSVLink } from "react-csv";
import button from "@components/Button/styles";
import Button from "@components/Button";
import Loader from "@components/Loader";
export const ButtonDownloadContestDataAsCSV = () => {
  const { activeChain } = useNetwork();
  const { asPath } = useRouter();
  const { chainId } = useContest();
  const { stateExportData, formatContestCSVData } = useExportContestDataToCSV();
  useEffect(() => {
    const startDownloading = async () => {
      await formatContestCSVData();
    };
    if (activeChain?.id === chainId) {
      startDownloading();
    }
  }, [activeChain?.id, chainId, asPath.split("/")[2], asPath.split("/")[3]]);
  return (
    <>
      {stateExportData.isLoading && (
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
