import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay, stripQuotationMarks } from "./utils";

const ContestInfoDisplayVariable = ({ nameContractFunction, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [contestName, setContestName] = useState("");

  const refresh = useCallback(async () => {
    try {
      const nameFuncResponse = await nameContractFunction();
      setContestName(nameFuncResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setContestName, nameContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, nameContractFunction]);

  return (
    <div>
      {stripQuotationMarks(tryToDisplay(contestName, false, blockExplorer))}
    </div>
  );
};

export default ContestInfoDisplayVariable;
