const { ApolloServer } = require('apollo-server-azure-functions');
const { PubSub } = require('apollo-server');
const { MongoClient } = require('mongodb');
require('dotenv').config();

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
    const client = await MongoClient.connect(process.env.MONGO_DB_URL);
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
        cors: {
            origin: '*',
            credentials: true,
        }
    });

    const response = await runHandler(request, context, handler)

    return response;
};