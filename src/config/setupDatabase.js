/**
 * Database Setup Script
 * Run with: npm run setup-db
 * Creates the database and schools table if they don't exist.
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

const setup = async () => {
  let connection;

  try {
    // Connect without a specific database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    const dbName = process.env.DB_NAME || "school_management";

    // Create database if not exists (use query() not execute() — USE/CREATE DB don't support prepared statements)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log(`✅ Database '${dbName}' ready`);

    // Close and reconnect with the database selected (avoids USE statement issue)
    await connection.end();
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: dbName,
    });

    // Create schools table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id          INT           NOT NULL AUTO_INCREMENT,
        name        VARCHAR(255)  NOT NULL,
        address     VARCHAR(500)  NOT NULL,
        latitude    FLOAT(10, 6)  NOT NULL,
        longitude   FLOAT(10, 6)  NOT NULL,
        created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_name (name),
        INDEX idx_location (latitude, longitude)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Table 'schools' ready");

    // Seed some sample data (optional)
    const [rows] = await connection.execute(
      "SELECT COUNT(*) AS count FROM schools",
    );
    if (rows[0].count === 0) {
      await connection.execute(`
        INSERT INTO schools (name, address, latitude, longitude) VALUES
          ('Delhi Public School', 'Mathura Road, New Delhi, 110003', 28.5355, 77.2410),
          ('Ryan International School', 'Sector 40, Gurugram, Haryana 122003', 28.4089, 77.0419),
          ('The Shri Ram School', 'Moulsari Avenue, DLF Phase 3, Gurugram', 28.4963, 77.0955),
          ('St. Columba School', 'Ashok Place, New Delhi, 110001', 28.6378, 77.2089),
          ('Modern School Barakhamba', 'Barakhamba Road, New Delhi, 110001', 28.6285, 77.2274)
      `);
      console.log("✅ Sample data seeded");
    }

    console.log(
      "\n🎉 Database setup complete! You can now start the server with: npm start\n",
    );
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

setup();
