import mongoose from "mongoose";
import dns from "dns";

// Use Google & Cloudflare DNS to resolve MongoDB Atlas SRV records
// (fixes ECONNREFUSED on Windows when local DNS can't resolve SRV)
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not set. MongoDB features will not work.");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
    conn: null,
    promise: null,
};

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectDB() {
    if (!MONGODB_URI) return null;

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 15000,
            })
            .then((mongoose) => {
                console.log("✅ Connected to MongoDB");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ MongoDB connection failed:", err.message);
                // Reset so next call retries instead of reusing failed promise
                cached.promise = null;
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch {
        cached.promise = null;
        cached.conn = null;
        return null;
    }
}

