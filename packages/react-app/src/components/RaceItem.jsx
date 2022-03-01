import React from "react";
import { Card, Button } from "antd";
import JokeItem from "./JokeItem";

export default function RaceItem({raceData}) {
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
    <Card>
      <h3>{raceData.name}</h3>
      <Button onClick={() => {window.location.reload();}}>Submit Joke</Button>
      {raceData.jokes.sort(voteSortFunc).map(
        (joke) => { return <JokeItem joke={joke} /> }
      )}
    </Card>
  );
}
