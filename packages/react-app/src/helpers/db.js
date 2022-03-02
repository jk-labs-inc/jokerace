import faunadb from "faunadb";

export const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNADB_KEY,
  domain: "db.us.fauna.com",
  scheme: "https",
});
export const q = faunadb.query;

export const getEntireCollectionQuery = collection =>
  client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection(collection))),
        q.Lambda(x => q.Get(x)),
      ),
    )
    .then(response => {
      return response.data;
    })
    .catch(error => console.log("error", error.message));

export const createRace = (name, startTime, endTime) =>
  client
    .query(
      q.Create(q.Collection("races"), {
        data: {
          id: q.Count(q.Documents(q.Collection("races"))),
          name: name,
          startTime: startTime,
          endTime: endTime,
          jokes: [],
        },
      }),
    )
    .then(ret => ret)
    .catch(err => console.warn(err));

export const createJoke = (raceId, jokeContent, author) => {
  client
    .query(
      q.Let(
        {
          doc: q.Get(q.Match(q.Index("race_id_index"), raceId)),
        },
        q.Update(q.Select(["ref"], q.Var("doc")), {
          data: {
            jokes: q.Append(
              {
                id: q.Count(q.Select(["data", "jokes"], q.Var("doc"))),
                votes: 0,
                content: jokeContent,
                author: author,
              },
              q.Select(["data", "jokes"], q.Var("doc")),
            ),
          },
        }),
      ),
    )
    .then(ret => console.log(ret))
    .catch(err => console.warn(err));
};
