import { client, q } from '../config/db'

export default function deleteJoke(jokeRef) {
    client.query(
    q.Delete(q.Ref(q.Collection('jokes'), jokeRef))
    )
    .then(res => res)
    .catch(err => console.warn(err.message))
}