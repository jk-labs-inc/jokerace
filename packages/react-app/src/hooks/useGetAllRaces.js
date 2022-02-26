import { client, q } from "../helpers/db";
import { useState, useEffect } from "react";
import RaceItem from "../components/RaceItem";

export default function useGetAllRaces() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("races"))),
          q.Lambda(x => q.Get(x)),
        ),
      )
      .then(response => {
        setResults(response.data.map(resp => resp.data.text));
      })
      .catch(error => console.log("error", error.message));
  }, []);

  return results.map(entry => {
    return RaceItem(entry);
  });
}
