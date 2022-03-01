import faunadb from "faunadb";

export const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNADB_KEY,
  domain: "db.us.fauna.com",
  scheme: "https",
});
export const q = faunadb.query;

export const getEntireCollectionQuery = (collection) => 
  client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection(collection))),
      q.Lambda(x => q.Get(x)),
    ),
  )
  .then(response => {
    console.log(response)
    return response.data;
  })
  .catch(error => console.log("error", error.message));

export const createRace = (paramDict) => {
    const nameParam = paramDict.name;
    const startTimeParam = paramDict.startTime;
    const endTimeParam = paramDict.endTime;

    client.query(
      q.Create(
        q.Collection('races'),
        {
          data: {
            name: nameParam,
            startTime: startTimeParam,
            endTime: endTimeParam,
            jokes: []
          },
        },
      )
    )
    .then(ret => ret)
    .catch(err => console.warn(err))
  }