import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay, stripQuotationMarks } from "./utils";
import Address from "../Address";

const ContestInfoDisplayVariable = ({ nameContractFunction, tokenContractFunction, address, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [contestName, setContestName] = useState("");
  const [contestToken, setContestToken] = useState("");

  const refresh = useCallback(async () => {
    try {
      const nameFuncResponse = await nameContractFunction();
      const tokenFuncResponse = await tokenContractFunction();
      setContestName(nameFuncResponse);
      setContestToken(tokenFuncResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setContestName, setContestToken, nameContractFunction, tokenContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, nameContractFunction, tokenContractFunction]);

  return (
    <div>
      {stripQuotationMarks(tryToDisplay(contestName, false, blockExplorer))}
      <div style={{ fontSize: 18 }}>Contest Address: {tryToDisplay(address, false, blockExplorer)}</div>
      <div style={{ fontSize: 18 }}>Voting Token Address: {tryToDisplay(contestToken, false, blockExplorer)}</div>
    </div>
  );
};

export default ContestInfoDisplayVariable;
