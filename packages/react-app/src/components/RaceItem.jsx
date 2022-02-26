import React from "react";
import { Divider } from "antd";
import { JokeItem } from ".";

export default function RaceItem(entry) {
  return ( 
    <div>
      <h1>Race: {entry.name}</h1>
      {entry.jokes.map(joke => { return JokeItem(joke) } )}
      <Divider />
    </div>
  );
}
