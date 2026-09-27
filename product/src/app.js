const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const productsRouter = require("./routes/productRoutes");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB connected:", config.mongoURI);
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    // Health check endpoint (dùng cho Docker healthcheck)
    this.app.get("/health", async (req, res) => {
      const dbState = mongoose.connection.readyState;
      // 1 = connected
      if (dbState === 1) {
        return res.status(200).json({ status: "ok", db: "connected" });
      }
      return res.status(503).json({ status: "error", db: "disconnected" });
    });

    this.app.use("/api/products", productsRouter);
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await this.disconnectDB();
    if (this.server) this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
