import mongoose, { Connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

class DatabaseConnector {
  private mongoServer: MongoMemoryServer | null = null;

  async connect(useMemoryDB: boolean = false) {
    if (useMemoryDB) {
      this.mongoServer = await MongoMemoryServer.create();
      const uri = this.mongoServer.getUri();
      await mongoose.connect(uri);
    } else {
      const uri = process.env.MONGO_URI || "";
      console.log("uri: ", uri);
      await mongoose.connect(uri);
    }

    return mongoose.connection;
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

export default DatabaseConnector;
