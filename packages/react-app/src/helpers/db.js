import faunadb from "faunadb";

const client = new faunadb.Client({ 
  secret: process.env.REACT_APP_FAUNADB_KEY,
  domain: 'db.us.fauna.com',
  scheme: 'https',
});
const q = faunadb.query;

export { client, q };
