import React from "react";
import { Collapse } from "antd";
import { JokeItem } from ".";

const { Panel } = Collapse;

export default function RaceItem(entry, index) {
  function voteSortFunc(joke1, joke2) {
    if (joke1.votes < joke2.votes) {
      return 1;
    }
    if (joke1.votes > joke2.votes) {
      return -1;
    }
    return 0;
  }

  return ( 
    <Panel header={entry.name} key={index}>
      <Collapse>
        {entry.jokes.sort(voteSortFunc).map((joke, index) => { return JokeItem(joke, index) })}
      </Collapse>
    </Panel>
  );
}
