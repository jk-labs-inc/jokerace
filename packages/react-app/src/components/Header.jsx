import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/seanmc9/JokeDaoV2Dev" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🃏 Joker contests"
        subTitle="open source, on-chain, collaborative decision-making platform"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
