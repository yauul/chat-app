const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');

const typeDefs = require('./graphql/typdefs');
const resolvers = require('./graphql/resolvers');

const dbURL = require('./config/db');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (ctx) => ctx,
});

mongoose.connect(dbURL.localhost, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});
let db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
