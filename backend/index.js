const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const FRONTEND = process.env.FRONTEND_CONNECTION;
const PORT = process.env.PORT;

const corsOptions = {
  origin: FRONTEND,
};

const stores = require("./stores");
console.log(stores);

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("<h1>Hello, world!!!</h1><p>This is Store Delivery API.</p>");
});

// get all stores
app.get("/api/stores", (req, res) => {
  res.json(stores);
});

app.listen(PORT, () => {
  console.log("Listening to PORT : http://localhost:" + PORT);
});
