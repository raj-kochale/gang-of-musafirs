import { MongoClient, MongoClientOptions } from "mongodb";
import dns from "dns";

// Use Google & Cloudflare DNS (same as mongoose setup)
try { dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]); } catch { /* ignore in edge */ }

const uri = process.env.MONGODB_URI || "";

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

async function connectWithRetry(client: MongoClient, retries = 3): Promise<MongoClient> {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.connect();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`MongoDB connect attempt ${i + 1} failed, retrying in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("MongoDB connection failed after retries");
}

if (!uri) {
  clientPromise = new Promise((_resolve, reject) => {
    reject(new Error("MONGODB_URI is not set — database features unavailable"));
  });
  clientPromise.catch(() => {});
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
    global._mongoClientPromise = connectWithRetry(global._mongoClient);
  }
  clientPromise = global._mongoClientPromise!;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = connectWithRetry(client);
}

export default clientPromise;
