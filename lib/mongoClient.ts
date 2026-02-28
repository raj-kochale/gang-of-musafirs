import { MongoClient } from "mongodb";
import dns from "dns";

// Use Google & Cloudflare DNS (same as mongoose setup)
try { dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]); } catch { /* ignore in edge */ }

const uri = process.env.MONGODB_URI || "";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Return a promise that rejects at runtime (not at import time)
  // so the build can still succeed.
  clientPromise = new Promise((_resolve, reject) => {
    reject(new Error("MONGODB_URI is not set — database features unavailable"));
  });
  // Prevent unhandled rejection crash during build
  clientPromise.catch(() => {});
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
    global._mongoClientPromise = global._mongoClient.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
