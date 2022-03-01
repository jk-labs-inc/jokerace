import React from "react";
import { client, q, getEntireCollectionQuery } from "../helpers/db";
import { useState, useEffect } from "react";
import { RaceSearch } from "../components";

export default function RacesPage() {

  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState([]);

  async function fetchRaces() {
    setIsLoading(true);
    const parsedResp = getEntireCollectionQuery("races").then(racesResp => setRaces(racesResp));
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
