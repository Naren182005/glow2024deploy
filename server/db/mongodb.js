
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'glow24_organics';

let client;
let database;

async function connectToDatabase() {
  if (database) return database;

  try {
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`Database name: ${dbName}`);
    console.log(`Connection string starts with: ${uri.substring(0, 20)}...`);

    client = new MongoClient(uri);

    await client.connect();
    console.log('Connected successfully to MongoDB Atlas');

    database = client.db(dbName);
    return database;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error stack:', error.stack);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  getDatabase: () => database,
};
