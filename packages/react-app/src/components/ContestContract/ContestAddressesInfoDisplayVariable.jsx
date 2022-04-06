import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";

const ContestAddressesInfoDisplayVariable = ({ tokenContractFunction, address, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [contestToken, setContestToken] = useState("");

  const refresh = useCallback(async () => {
    try {
      const tokenFuncResponse = await tokenContractFunction();
      setContestToken(tokenFuncResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setContestToken, tokenContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, tokenContractFunction]);

  return (
    <div>
      <div style={{ fontSize: 18 }}>Contest Address: {tryToDisplay(address, false, blockExplorer)}</div>
      <div style={{ fontSize: 18 }}>Voting Token Address: {tryToDisplay(contestToken, false, blockExplorer)}</div>
    </div>
  );
};

export default ContestAddressesInfoDisplayVariable;
