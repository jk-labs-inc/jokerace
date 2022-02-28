import React from "react";
import { Collapse } from "antd";
import { JokeItem } from ".";

const { Panel } = Collapse;

export default function RaceItem(entry, index) {
  return ( 
    <Panel header={entry.name} key={index}>
      <Collapse>
        {entry.jokes.map((joke, index) => { return JokeItem(joke, index) } )}
      </Collapse>
    </Panel>
  );
}
