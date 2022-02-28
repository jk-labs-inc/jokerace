import React from "react";
import { Collapse } from "antd";
import { JokeItem } from ".";

const { Panel } = Collapse;

export default function RaceItem(raceData, index) {
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
    <Panel header={raceData.name} key={index}>
      <Collapse>
        {raceData.jokes.sort(voteSortFunc).map((joke, index) => { return JokeItem(joke, index) })}
      </Collapse>
    </Panel>
  );
}
