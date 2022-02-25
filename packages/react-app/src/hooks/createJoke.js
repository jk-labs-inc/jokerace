import { client, q } from '../config/db'

export default function createNote(text) {
    client.query(
    q.Create(
        q.Collection('notes'),
        {
        data: {
            text
        },
        },
    )
    )
    .then(ret => ret)
    .catch(err => console.warn(err))
}