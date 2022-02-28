import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

export default function JokeItem(joke, index) {
  return (
    <Panel header={joke.content} key={index}>
      <div>
        <div>Votes: {joke.votes}</div>
      </div>
    </Panel>
  );
}