//src/resolvers/Mutation.js
// import { ObjectId } from 'mongodb'; ES6
const ObjectId = require('mongodb').ObjectId;

const PRODUCT_ADDED = 'PRODUCT_ADDED';

const createProduct = async (parent, args, { Products, pubsub }, info) => {
    let result = await Products.insertOne(args);
    let newProduct = result.ops[0];

    await pubsub.publish(PRODUCT_ADDED, { newProduct });

    return newProduct;
}

const editProduct = async (parent, args, { Products }, info) => {
    const _id = args._id;
    delete args._id;
    await Products.updateOne({ "_id": ObjectId(_id) }, { $set: args });
    args._id = _id;
    return args;
}

const deleteProduct = async (parent, args, { Products }, info) => {
    try {
        Products.deleteOne({ "_id": ObjectId(args._id) });
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}


module.exports = {
    createProduct,
    editProduct,
    deleteProduct
}