const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
require("dotenv").config();

const sqlite = new sqlite3.Database("./pharma.db");

async function migrate() {
  const mysqlDb = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  console.log("Connected to MySQL.");

  // -------------------------
  // MEDICINES
  // -------------------------

  const medicines = await new Promise(
    (resolve, reject) => {
      sqlite.all(
        "SELECT * FROM medicines",
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    }
  );

  for (const medicine of medicines) {
    await mysqlDb.query(
      `
      INSERT IGNORE INTO medicines
      (
        id,
        batch,
        name,
        manufacturer,
        manufacturing,
        expiry,
        quantity,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        medicine.id,
        medicine.batch,
        medicine.name,
        medicine.manufacturer,
        medicine.manufacturing,
        medicine.expiry,
        medicine.quantity,
        medicine.status,
      ]
    );
  }

  console.log(
    `Medicines processed: ${medicines.length}`
  );

  // -------------------------
  // SHIPMENTS
  // -------------------------

  const shipments = await new Promise(
    (resolve, reject) => {
      sqlite.all(
        "SELECT * FROM shipments",
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    }
  );

  for (const shipment of shipments) {
    await mysqlDb.query(
      `
      INSERT IGNORE INTO shipments
      (
        id,
        batch,
        medicine,
        origin,
        destination,
        status,
        updated
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        shipment.id,
        shipment.batch,
        shipment.medicine,
        shipment.origin,
        shipment.destination,
        shipment.status,
        shipment.updated,
      ]
    );
  }

  console.log(
    `Shipments processed: ${shipments.length}`
  );

  // -------------------------
  // ALERTS
  // -------------------------

  const alerts = await new Promise(
    (resolve, reject) => {
      sqlite.all(
        "SELECT * FROM alerts",
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    }
  );

  for (const alert of alerts) {
    await mysqlDb.query(
      `
      INSERT IGNORE INTO alerts
      (
        id,
        type,
        title,
        description,
        batch,
        location,
        time,
        icon
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        alert.id,
        alert.type,
        alert.title,
        alert.description,
        alert.batch,
        alert.location,
        alert.time,
        alert.icon,
      ]
    );
  }

  console.log(
    `Alerts processed: ${alerts.length}`
  );

  await mysqlDb.end();
  sqlite.close();

  console.log("Migration completed successfully.");
}

migrate().catch((error) => {
  console.error(
    "Migration failed:",
    error.message
  );

  sqlite.close();
});