import { Logger } from "@packages/logger";
import express from "express";
import { initializedDatabase } from "./config/dataSource";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { corsConfig } from "./config/cors";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    if (!process.env.SERVER_PORT)
      throw new Error("Environment variable `SERVER_PORT` not found");

    this.app.set("port", process.env.SERVER_PORT);

    // Initialize the database connection
    initializedDatabase();

    // CORS configuration with emphasis on cookie support
    this.app.use(corsConfig());

    // Middleware for logging HTTP requests
    this.app.use(morgan("tiny"));

    // Add cookie parser middleware
    this.app.use(cookieParser());
  }

  public routes(): void {
    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      Logger.info(`API is running at http://localhost:${this.app.get("port")}`);
    });
  }
}

export const server = new Server();
server.start();
