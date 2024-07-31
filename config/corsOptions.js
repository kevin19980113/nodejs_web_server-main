// Cross Origin Resource Sharing (CORS) middleware
const allowedOrigins = require("./allowedOrigins"); // to accpet requests from these domains

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // continue to the next middleware
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // Success status when CORS is allowed
};

module.exports = corsOptions;
