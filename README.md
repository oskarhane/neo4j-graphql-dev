# neo4j-graphql-dev

Small tool to quickly spin up a GraphQL server serving the desired GraphQL schema file and watch for changes.

## Usage

```
neo4j-graphql-dev \
--bolt neo4j://localhost:7687 \
-u neo4j \
-p newpassword \
--schema ~/path-to/typedefs.graphql
```

Above command will start an Express server with the `express-graphql` middleware on port `4000` (change port using the env variable `PORT`).

### Automatic reload

The server will automatically reload the schema on every change to the schema file.

### GraphiQL

Go to [http://localhost:4000](http://localhost:4000) to get to GraphiQL.
