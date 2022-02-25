import { client, q } from "../helpers/db";

export default function getAllJokes() {
  client
    .query(q.Paginate(q.Match(q.Ref("indexes/all_jokes"))))
    .then(response => {
      const notesRefs = response.data;
      // create new query out of notes refs.
      // https://docs.fauna.com/fauna/current/api/fql/
      const getAllJokeDataQuery = notesRefs.map(ref => {
        return q.Get(ref);
      });
      // query the refs
      return client.query(getAllJokeDataQuery).then(data => data);
    })
    .catch(error => console.warn("error", error.message));
}
