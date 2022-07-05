import { Divider } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay, stripQuotationMarks } from "./utils";

const ContestInfoDisplayVariable = ({ nameContractFunction, promptContractFunction, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [contestName, setContestName] = useState("");
  const [contestPrompt, setContestPrompt] = useState("");

  const refresh = useCallback(async () => {
    try {
      const nameFuncResponse = await nameContractFunction();
      setContestName(nameFuncResponse);
      const promptFuncResponse = await promptContractFunction();
      setContestPrompt(promptFuncResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setContestName, setContestPrompt, nameContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, nameContractFunction, promptContractFunction]);

  return (
    <div>
      {stripQuotationMarks(tryToDisplay(contestName, false, blockExplorer))}
      <div></div>
      {"Prompt: " + stripQuotationMarks(tryToDisplay(contestPrompt, false, blockExplorer))}
    </div>
  );
};

export default ContestInfoDisplayVariable;
