import React from "react";
import { client, q } from "../helpers/db";
import { useState, useEffect } from "react";
import { RaceSearch } from "../components";

export default function RacesPage() {

  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState([]);

  async function fetchRaces() {
    setIsLoading(true);

    const parsedResp = await client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("races"))),
          q.Lambda(x => q.Get(x)),
        ),
      )
      .then(response => {
        return response.data;
      })
      .catch(error => console.log("error", error.message));

    setRaces(parsedResp);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRaces();
  }, []);

  if (isLoading) {
    return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        Loading...
      </div>
    );
  } else {
    return (
      <div>
        <RaceSearch races={races} />
      </div>
    );
  }
}
