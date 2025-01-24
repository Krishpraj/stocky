const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Ross6688",
  database: "user_auth",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release(); // Release the connection back to the pool
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the User Authentication Server!");
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.post("/register", (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Check if the username already exists
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }

    if (results.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    // Insert the new user
    const insertQuery = `
        INSERT INTO users (FirstName, LastName, username, password)
        VALUES (?, ?, ?, ?)
      `;
    db.query(
      insertQuery,
      [firstName, lastName, username, password],
      (err, results) => {
        if (err) {
          console.error("Database insertion error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Server error." });
        }

        return res
          .status(201)
          .json({ success: true, message: "User registered successfully." });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Check if the user exists
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const user = results[0];

    // Compare the hashed password
    if (password!=user.password){
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Successful login
    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
      },
    });
  });
});
