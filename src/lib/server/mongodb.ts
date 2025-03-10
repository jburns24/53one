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

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(env.MONGODB_URI);
  clientPromise = client.connect();
}

export { clientPromise };
