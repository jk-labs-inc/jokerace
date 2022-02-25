import { client, q } from "../helpers/db";

export default function deleteJoke(jokeRef) {
  client
    .query(q.Delete(q.Ref(q.Collection("jokes"), jokeRef)))
    .then(res => res)
    .catch(err => console.warn(err.message));
}
