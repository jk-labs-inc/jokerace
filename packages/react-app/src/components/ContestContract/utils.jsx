import React from "react";

import Address from "../Address";

const { utils } = require("ethers");

const stripQuotationMarks = (input) => {
  let retString = ""
  if (input && ((typeof input === 'string' || input instanceof String))) {
    retString = input.replace(/^\"/, '').replace(/\"$/, '').replace(/\\\"/g, '\"');
    return retString;
  }
  return input
}

const tryToDisplay = (thing, asText = false, blockExplorer) => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      const displayable = "" + thing;
      return asText ? displayable : <span style={{ overflowWrap: "break-word", width: "100%" }}>{displayable}</span>;
    }
  }
  if (thing && thing.indexOf && thing.indexOf("0x") === 0 && thing.length === 42) {
    return asText ? thing : <Address address={thing} fontSize={22} blockExplorer={blockExplorer} />;
  }
  if (thing && thing.indexOf && thing.indexOf("https://") === 0) {
    return asText ? thing : 
      (
        (thing.lastIndexOf(".jpg") === (thing.length - 4) || thing.lastIndexOf(".png") === (thing.length - 4)) ?
        <img src={thing} width="300" height="300" /> :
        <a style={{ overflowWrap: "break-word", width: "100%" }} target="_blank" href={thing}>{thing}</a>
      )
  }
  if (thing && thing.constructor && thing.constructor.name === "Array") {
    const mostReadable = v => (["number", "boolean"].includes(typeof v) ? v : tryToDisplayAsText(v));
    const displayable = JSON.stringify(thing.map(mostReadable));
    return asText ? (
      displayable
    ) : (
      <span style={{ overflowWrap: "break-word", width: "100%" }}>{displayable.replaceAll(",", ",\n")}</span>
    );
  }
  return JSON.stringify(thing);
};

const tryToDisplayAsText = thing => tryToDisplay(thing, true);

export { tryToDisplay, tryToDisplayAsText, stripQuotationMarks };
