import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";

const ContestNameDisplayVariable = ({ contractFunction, functionInfo, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [variable, setVariable] = useState("");

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await contractFunction();
      setVariable(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setVariable, contractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, contractFunction]);

  return (
    <div>
      {tryToDisplay(variable, false, blockExplorer).replace(/['"]+/g, '')}
    </div>
  );
};

export default ContestNameDisplayVariable;
