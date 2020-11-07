const express = require("express");
const connectDB = require("./config/DB");
const path = require("path");

const app = express();

// Connect DATABASE
connectDB();

// Init Middleware => using new kind of bodyParser
app.use(express.json({ extended: false }));

// Define Routes
app.use("/create", require("./routes/api/users"));
app.use("/view", require("./routes/api/views"));

if (process.env.NODE_ENV === "production") {
  // Set static forlder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "client",
        "build",
        "index.html"
      )
    );
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);
