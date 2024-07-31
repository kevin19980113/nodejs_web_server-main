const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors"); // to allow cross-origin requests
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const PORT = process.env.PORT || 3500;

// node.js works like waterfall

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware to handle json data
app.use(express.json());

// middleware for cookies
// we don't need to post cookies becuase, everytime a request comes in,
// it parses the Cookie header in the incoming request
app.use(cookieParser());

// serve static files from the 'public' folder (apply css)
app.use(express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

// routing
app.use("/", require("./routes/root")); // this will allow any request coming from '/' to the routes/root.js file
app.use("/subdir", require("./routes/subdir")); // this will allow any request coming from '/subdir' to the routes/subdir.js file
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// since node.js works like waterfall, routes dont need to be authorized should be above this line
app.use(verifyJWT); // verify JWT middleware (to access protected routes I should check that users have a valid access token)
app.use("/employees", require("./routes/api/employees")); // I would only allow authorized users to access this route

// checked all other routes upper this line before redirecting to 404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Page not found" });
  } else {
    res.type("txt").send("404 Page Not Found");
  }
});
// all function sets up a route that will match any HTTP method (GET, POST, PUT, DELETE, etc.)
// and any path that hasn't been matched by previous routes.
// The "*" is a wildcard that matches any path.
// custom error handling middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
