import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

// Check for MongoDB URI
if (!env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Declare global for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Configure MongoDB connection options to handle SSL/TLS issues
const options = {
  ssl: true,
  sslValidate: false, // In development, you might want to disable SSL validation
  connectTimeoutMS: 30000, // Increase connection timeout
  socketTimeoutMS: 30000, // Increase socket timeout
  retryWrites: true,
  retryReads: true
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(env.MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(env.MONGODB_URI, options);
  clientPromise = client.connect();
}

export { clientPromise };
