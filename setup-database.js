import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function setupDatabase() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connecting to NeonDB...");
    await client.connect();
    console.log("Connected successfully!");

    console.log("Reading database setup SQL...");
    const sql = fs.readFileSync('database_setup.sql', 'utf8');
    
    console.log("Executing database setup...");
    await client.query(sql);
    
    console.log("Database setup completed successfully!");
    console.log("Tables created: users, countries, visited_countries");
    console.log("Sample data inserted.");
    
  } catch (error) {
    console.error("Database setup failed:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

setupDatabase();
