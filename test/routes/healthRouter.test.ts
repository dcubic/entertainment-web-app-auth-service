import request from "supertest";
import { Express } from "express-serve-static-core";
import { createApp } from "../../src/app/app";
import DatabaseConnector from "../../src/database/DatabaseConnector";
import StatusCode from "../../src/utils/StatusCode";

let databaseConnector: DatabaseConnector;
let app: Express;

beforeAll(async () => {
  databaseConnector = new DatabaseConnector();
  const connection = await databaseConnector.connect(true);
  app = await createApp(connection);
});

describe("healthCheck", () => {
  it("success case", async () => {
    const response = await request(app).get("/auth/health");
    
    expect(response.status).toBe(StatusCode.OK);
  });
});
