#! /usr/bin/env node
const yargs = require("yargs");
const neo4j = require("neo4j-driver");
const fs = require("fs");
const { startServer, stopCurrent } = require("./server");

const usage =
    "\nUsage: neo4j-graphql-dev --bolt <bolt-url> --db <database> -u <db-username> -p <db-password> --schema <path-to-graphql-schema-file>";
yargs
    .usage(usage)
    .option("b", {
        alias: "bolt",
        describe: "Bolt URL to the Neo4j DBMS",
        type: "string",
        demandOption: false,
        default: "neo4j://localhost:7687",
    })
    .option("db", { describe: "Neo4j database name", type: "string", demandOption: false, default: "" })
    .option("u", {
        alias: "username",
        describe: "Username to use with the DBMS connection",
        type: "string",
        demandOption: true,
    })
    .option("p", {
        alias: "password",
        describe: "Password to use with the DBMS connection",
        type: "string",
        demandOption: true,
    })
    .option("schema", {
        describe: "GraphQL type definitions",
        type: "string",
        demandOption: false,
        default: "./schema.graphql",
    })
    .help(true).argv;

const driver = neo4j.driver(yargs.argv["b"], neo4j.auth.basic(yargs.argv["u"], yargs.argv["p"]));

let typeDefs = fs.readFileSync(yargs.argv["schema"], "utf8").toString();

fs.watchFile(yargs.argv["schema"], { persistent: true, interval: 1000 }, () => {
    typeDefs = fs.readFileSync(yargs.argv["schema"], "utf8").toString();
    console.log("Restarting server");
    stopCurrent()
        .then(() => startServer(driver, yargs.argv["db"], typeDefs))
        .catch((e) => console.log("Restart failed with", e));
});

startServer(driver, yargs.argv["db"], typeDefs);
