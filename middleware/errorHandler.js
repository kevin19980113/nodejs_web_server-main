const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message); // set 500 server error status and show error message to the client
  // we don't have to use next() here because this is error handling middleware
};

module.exports = errorHandler;
