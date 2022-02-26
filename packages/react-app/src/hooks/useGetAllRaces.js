import { client, q } from "../helpers/db";
import { useState, useEffect } from "react";
import { RaceItem } from "../components";

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
          // console.log(response.data)
          return response.data;
        })
        .catch(error => console.log("error", error.message));

      setData(parsedResp);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  console.log(data);

  return isLoading ? (
    <div>Loading</div>
  ) : (
    data.map(entry => {
      return RaceItem(entry.data);
    })
  );
}
