// const { MongoClient } = require('mongodb');
// or as an es module:
import { MongoClient } from 'mongodb'
import 'dotenv/config'

// Connection URL
const url = process.env.DEVELOPMENT_MONGODB_HOST;
const client = new MongoClient(url);

// Database Name
const dbName = process.env.DEVELOPMENT_MONGODB_DATABASE_NAME;


// Use connect method to connect to the server
await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);
const collection = db.collection(process.env.DEVELOPMENT_MONGODB_DATABASE_COLLECTION);

// the following code examples can be pasted here...
export { client, collection };