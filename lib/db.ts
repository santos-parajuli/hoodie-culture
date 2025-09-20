import { MongoClient, ServerApiVersion } from 'mongodb';

// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

declare global {
	var _mongoose: typeof mongoose | undefined;
	var _mongoClient: MongoClient | undefined;
	var _clientPromise: Promise<MongoClient> | undefined;
}

const mongoOptions = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
};

// Connect to Mongoose & MongoClient once per process
export async function dbConnect() {
	if (!global._mongoose) {
		global._mongoose = await mongoose.connect(MONGODB_URI, { bufferCommands: true });
		console.log('✅ Mongoose connected');
	}

	if (!global._mongoClient) {
		global._mongoClient = new MongoClient(MONGODB_URI, mongoOptions);
		global._clientPromise = global._mongoClient.connect().then((client) => {
			console.log('✅ MongoClient connected');
			return client;
		});
	}

	return { mongoose: global._mongoose, client: await global._clientPromise! };
}

// For NextAuth adapter
export const clientPromise = (async () => {
	const { client } = await dbConnect();
	return client;
})();
