import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// NeonDB connection using connection string
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to database with error handling
async function connectDB() {
  try {
    await db.connect();
    console.log("Connected to NeonDB successfully!");
  } catch (err) {
    console.error("Database connection error:", err);
    console.log("Server will continue running, but database operations may fail.");
  }
}

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1; ",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}
app.get("/", async (req, res) => {
  try {
    const countries = await checkVisisted();
    const currentUser = await getCurrentUser();

    // Get error and success messages from query parameters
    const error = req.query.error;
    const success = req.query.success;

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: currentUser ? currentUser.color : '#27ae60',
      error: error,
      success: success
    });
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).send("Server Error: " + error.message);
  }
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  if (!input || input.trim() === "") {
    return res.redirect("/?error=" + encodeURIComponent("Please enter a country name"));
  }

  try {
    await getCurrentUser(); // Ensure user data is fresh

    // Search for country
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.redirect("/?error=" + encodeURIComponent(`Country "${input}" not found. Please check the spelling.`));
    }

    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/?success=" + encodeURIComponent(`${input} added successfully!`));
    } catch (err) {
      console.log("Insert error:", err);
      if (err.code === '23505') { // Unique constraint violation
        res.redirect("/?error=" + encodeURIComponent(`${input} is already in your visited countries list.`));
      } else {
        res.redirect("/?error=" + encodeURIComponent("Failed to add country. Please try again."));
      }
    }
  } catch (err) {
    console.log("Database error:", err);
    res.redirect("/?error=" + encodeURIComponent("Database error. Please try again."));
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  if (!name || name.trim() === "") {
    return res.render("new.ejs", { error: "Please enter your name" });
  }

  if (!color) {
    return res.render("new.ejs", { error: "Please select a color" });
  }

  try {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
      [name.trim(), color]
    );

    const id = result.rows[0].id;
    currentUserId = id;

    res.redirect("/?success=" + encodeURIComponent(`Welcome ${name}! You can now start adding countries.`));
  } catch (err) {
    console.error("Error creating user:", err);
    res.render("new.ejs", { error: "Failed to create user. Please try again." });
  }
});

// Health check endpoint for deployment monitoring
app.get('/health', async (_req, res) => {
  try {
    // Check database connection
    await db.query('SELECT 1');

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
});
