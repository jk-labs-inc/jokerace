import { client, q } from "../helpers/db";

export default function editJoke(jokeId, newText) {
  client
    .query(q.Update(q.Ref(q.Collection("jokes"), jokeId), { data: { text: newText } }))
    .then(ret => console.log(ret))
    .catch(err => console.warn(err));
}
