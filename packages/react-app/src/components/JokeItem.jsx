import React from "react";
import { Divider } from "antd";

export default function JokeItem(joke) {
  return ( 
    <div>
      <div>Joke: {joke.content}</div>
      <div>Votes: {joke.votes}</div>
    </div>
  );
}