require("dotenv").config();
const App = require("./src/app");

const app = new App();

app
  .connectDB()
  .then(() => app.start())
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
