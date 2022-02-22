const { ApolloServer, gql } = require("apollo-server");
const { getDB } = require("./mysql");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Todo {
    id: Int
    description: String
    isFinished: Boolean
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    todos: [Todo]
    todo(id: Int!): Todo
  }

  type Mutation {
    addTodo(description: String!): Int!
    editTodo(id: Int!, description: String!, isFinished: Int!): String
    deleteTodo(id: Int!): String
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    todos: async () => {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM todo", (err, todos) => {
          if (err) {
            reject(err);
          } else {
            resolve(todos);
          }
        });
      });
    },
    todo: async (_, { id }) => {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const query = `SELECT * FROM todo WHERE id = ${id}`;
        db.query(query, (err, todos) => {
          if (err) {
            reject(err);
          } else {
            resolve(todos[0]);
          }
        });
      });
    },
  },
  Mutation: {
    // where our new resolver function will go
    addTodo: async (_, { description }) => {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO todo (description) VALUES ("${description}");`;
        db.query(query, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.insertId);
          }
        });
      });
    },
    editTodo: async (_, { id, description, isFinished }) => {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const query = `UPDATE todo SET description = '${description}', isFinished = '${isFinished}' WHERE id = '${id}'`;
        db.query(query, (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.affectedRows === 0) resolve("Edit fail");
            else resolve("Edit successfully");
          }
        });
      });
    },
    deleteTodo: async (_, { id }) => {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const query = `DELETE FROM todo WHERE id = '${id}'`;
        db.query(query, (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.affectedRows === 0) resolve("Delete fail");
            else resolve("Delete successfully");
          }
        });
      });
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
