import { client, q } from "../helpers/db";
import { useState, useEffect } from "react";
import { RaceSearch } from "../components";

export default function useGetAllRaces() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
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

      setData(parsedResp);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return RaceSearch(data, searchInput, setSearchInput, filteredResults, setFilteredResults)
  };
}
