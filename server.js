const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { Neo4jGraphQL } = require("@neo4j/graphql");
var cors = require("cors");
let server;

module.exports.stopCurrent = async function stopCurrent() {
    return new Promise((resolve) => {
        if (server && server.close) {
            return server.close(() => {
                server = null;
                resolve();
            });
        }
        resolve();
    });
};

module.exports.startServer = function startServer(driver, db, typeDefs) {
    const neoSchema = new Neo4jGraphQL({ typeDefs, driver, config: { driverConfig: { database: db } } });
    const port = process.env.PORT || 4000;
    const app = express();
    app.use(cors());
    app.use(
        "/graphql",
        graphqlHTTP({
            schema: neoSchema.schema,
            graphiql: true,
            context: ({ req }) => ({ req, driver }),
        })
    );
    server = app.listen(port, () => console.log(`GraphiQL ready at http://localhost:${port}/graphql`));
};
