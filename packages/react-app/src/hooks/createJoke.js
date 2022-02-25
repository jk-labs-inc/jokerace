import { client, q } from "../helpers/db";

export default function createJoke(text) {
  client
    .query(
      q.Create(q.Collection("jokes"), {
        data: {
          text,
        },
      }),
    )
    .then(ret => ret)
    .catch(err => console.warn(err));
}
