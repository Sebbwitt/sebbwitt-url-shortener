// Require: Environment variable in development environment
// Otherwise rely on host environment setting
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Require: Path
const path = require("path");

// Retrieve PORT from environment variable if set
// Otherwise set default to 3333
const PORT = process.env.PORT || 3333;

// Require: Express App & CORS
const express = require("express");
const app = express();
const cors = require("cors");

// Express App setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/client/build")));

/** Route Setup API */
// URL - mini path
const urlRouter = require("./routes/Urls");
app.use("/mini", urlRouter);




app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));