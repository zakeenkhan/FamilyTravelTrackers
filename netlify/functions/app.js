const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const serverless = require("serverless-http");

const app = express();

// NeonDB connection using connection string
let db;

async function getDB() {
  if (!db) {
    db = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await db.connect();
      console.log("Connected to NeonDB successfully!");
    } catch (err) {
      console.error("Database connection error:", err);
      throw err;
    }
  }
  return db;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set view engine
app.set('view engine', 'ejs');

// Serve static files
app.use('/styles', express.static('dist/public/styles'));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const database = await getDB();
  const result = await database.query(
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
  const database = await getDB();
  const result = await database.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  try {
    const countries = await checkVisisted();
    const currentUser = await getCurrentUser();

    // For Netlify, we need to render with absolute paths
    const fs = require('fs');
    const path = require('path');
    const ejs = require('ejs');

    // Read the template file
    const templatePath = path.join(process.cwd(), 'dist/views/index.ejs');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Render the template
    const html = ejs.render(template, {
      countries: countries,
      total: countries.length,
      users: users,
      color: currentUser ? currentUser.color : '#27ae60',
    });

    res.send(html);
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).send("Server Error: " + error.message);
  }
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const database = await getDB();
    const result = await database.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await database.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    try {
      const fs = require('fs');
      const path = require('path');
      const ejs = require('ejs');

      const templatePath = path.join(process.cwd(), 'dist/views/new.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      const html = ejs.render(template, {});

      res.send(html);
    } catch (error) {
      console.error("Error rendering new.ejs:", error);
      res.status(500).send("Error loading page");
    }
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  try {
    const database = await getDB();
    const result = await database.query(
      "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
      [name, color]
    );

    const id = result.rows[0].id;
    currentUserId = id;

    res.redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    res.redirect("/");
  }
});

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    const database = await getDB();
    await database.query('SELECT 1');

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

module.exports.handler = serverless(app);
