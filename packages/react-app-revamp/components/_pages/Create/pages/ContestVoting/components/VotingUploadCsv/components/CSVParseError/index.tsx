import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";
import { FC, ReactNode, useMemo } from "react";

export type ParseError = "unexpectedHeaders" | "missingColumns" | "limitExceeded" | "allZero" | "";

interface CSVParseErrorProps {
  type: ParseError;
}

const CSVParseError: FC<CSVParseErrorProps> = ({ type }) => {
  const errorContent = useMemo<ReactNode>(() => {
    if (!type) return null;

    switch (type) {
      case "missingColumns":
      case "unexpectedHeaders":
        return (
          <div className="flex flex-col text-[16px] animate-reveal">
            <p className=" text-negative-11">
              Ruh-roh! CSV couldn’t be imported.{" "}
              <span className="font-bold">
                Make sure there are no headers or additional <br />
                columns.
              </span>{" "}
              CSV should have 1) only two columns, 2) a first column containing <span className="italic">
                only
              </span>{" "}
              valid <br />
              EVM addresses, and 3) a second column containing number of votes.
            </p>
          </div>
        );
      case "limitExceeded":
        return (
          <div className="flex flex-col text-[16px] animate-reveal">
            <p className=" text-negative-11">
              Ruh-roh! CSV file has too many rows.{" "}
              <span className="font-bold">The maximum number of rows allowed is {formatNumber(MAX_ROWS)}</span>
            </p>
          </div>
        );
      case "allZero":
        return (
          <div className="flex flex-col text-[16px] animate-reveal">
            <p className=" text-negative-11">
              Ruh-roh! All votes in the CSV file are 0.{" "}
              <span className="font-bold">CSV should have at least one vote above zero.</span>
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [type]);

  return <>{errorContent}</>;
};

export default CSVParseError;
