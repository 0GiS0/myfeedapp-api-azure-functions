// const { ApolloServer, PubSub } = require('apollo-server'); ES6
const ApolloServer = require('apollo-server-azure-functions').ApolloServer;
const PubSub = require('apollo-server').PubSub;
// const { MongoClient } = require('mongodb'); ES6
const MongoClient = require('mongodb').MongoClient;

//1. Schema
const typeDefs = require('./src/schema');

//2. Resolvers
const Query = require('./src/resolvers/Query');
const Mutation = require('./src/resolvers/Mutation');
const Subscription = require('./src/resolvers/Subscription');
const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription
};


const runHandler = (request, context, handler) =>
    new Promise((resolve, reject) => {
        const callback = (error, body) => (error ? reject(error) : resolve(body))

        handler(context, request, callback)
    })


module.exports = async (context, request) => {
    //We need an async function to wait to MongoDB connection
    const client = await MongoClient.connect('mongodb://localhost:27017');
    context.log('Connected successfully to MongoDB');
    db = client.db('realfoodingdb');
    
    const server = new ApolloServer({    
        typeDefs,
        resolvers,
        context: {
            Products: db.collection('products'),
            pubsub
        }
    });

    const handler = server.createHandler({
        cors: { credentials: true, origin: true }
    });

    const response = await runHandler(request, context, handler)

    return response;
};