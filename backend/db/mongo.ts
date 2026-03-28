import mongoose from "mongoose";

let connected = false;

export async function connectToMongo(): Promise<void> {
  if (connected) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || "startup_navigator";

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(mongoUri, { dbName });
  connected = true;
}

export function getMongoConnection(): mongoose.Connection {
  return mongoose.connection;
}
