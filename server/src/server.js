// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8001;
//const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
// const bcrypt = require("bcrypt");
// require cors and update. 
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cors());
//app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//??

// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // For legacy browser support
// }

// app.use(cors(corsOptions));
//COMEBACK LATER

// app.use(
//   "/styles",
//   sassMiddleware({
//     source: __dirname + "/styles",
//     destination: __dirname + "/public/styles",
//     isSass: false, // false => scss, true => sass
//   })
// );

//app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your owna
app.use("/", usersRoutes(db));
app.use("/api/auth", authRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  //res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});