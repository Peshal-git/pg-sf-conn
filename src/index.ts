import "dotenv/config";
import express from "express";
import { Pool } from "pg";
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Heroku Postgres
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salesforce.testobject__c");
    res.send(`
      <h1>TestObjects from Salesforce</h1>
      <ul>
        ${result.rows.map((row) => `<li>${row.name__c} - ${row.value__c}</li>`).join("")}
      </ul>
    `);
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
