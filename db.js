const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost", // Your MySQL host (usually 'localhost' for local development)
  user: "root", // Your MySQL username
  password: "Mtungwa2000*", // Your MySQL password
  database: "banking_system", // The name of your database
  port: 3306, // This is the MySQL server port
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database as ID " + connection.threadId);
});

// Export the connection for use in other parts of your application
module.exports = connection;

/*
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    process.exit(1); // Exit the process with an error code
  }
  console.log("Connected to the MySQL database as ID " + connection.threadId);
});

process.on("SIGINT", () => {
  connection.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err.stack);
    }
    console.log("Database connection closed");
    process.exit(0);
  });
});
*/
