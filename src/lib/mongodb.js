import "server-only";

import { MongoClient } from "mongodb";

const options = {
  appName: "smart-door-dashboard",
};

let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI. Add it to your environment variables.");
  }

  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === "development" && global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
    return clientPromise;
  }

  clientPromise = new MongoClient(uri, options).connect();
  if (process.env.NODE_ENV === "development") {
    global._mongoClientPromise = clientPromise;
  }
  return clientPromise;
}

export async function getDatabase() {
  const mongoClient = await getClientPromise();
  return mongoClient.db(process.env.MONGODB_DB || "smart_door_dashboard");
}
