import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

class DatabaseConnector {
  private mongoServer: MongoMemoryServer | null = null;

  async connect(useMemoryDB: boolean = false): Promise<typeof mongoose> {
    if (useMemoryDB) {
      this.mongoServer = await MongoMemoryServer.create();
      const uri = this.mongoServer.getUri();
      await mongoose.connect(uri);
    } else {
      const uri =
        process.env.MONGO_URI ||
        "mongodb+srv://dcubic:PVOpLHciOg9OZGVr@freecluster.h1hyyzp.mongodb.net/users?retryWrites=true";
      await mongoose.connect(uri);
    }

    return mongoose;
  }

  async disconnect() {
    await mongoose.disconnect();
    if (this.mongoServer) {
      this.mongoServer.stop();
    }
  }

  async clearDatabase(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

const createDatabaseConnection = async (
  databaseConnector: DatabaseConnector = new DatabaseConnector(),
  useMemoryDB: boolean = false
): Promise<typeof mongoose> => {
  return await databaseConnector.connect(useMemoryDB);
};

export { DatabaseConnector, createDatabaseConnection };
