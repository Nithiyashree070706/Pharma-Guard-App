require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===============================
// MYSQL CONNECTION
// ===============================

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ===============================
// TEST DATABASE CONNECTION
// ===============================

async function testDatabase() {
  try {
    const connection = await db.getConnection();

    console.log("MySQL database connected.");
    console.log("Database: pharmaguard");

    connection.release();
  } catch (error) {
    console.error(
      "MySQL connection failed:",
      error.message
    );
  }
}

testDatabase();

// ===============================
// STATUS
// ===============================

app.get("/api/status", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "online",
      message: "PharmaGuard backend is running",
      database: "MySQL",
    });
  } catch (error) {
    res.status(500).json({
      status: "offline",
      error: error.message,
    });
  }
});

// ===============================
// MEDICINES
// ===============================

// Get medicines
app.get("/api/medicines", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM medicines ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Add medicine
app.post("/api/medicines", async (req, res) => {
  const {
    batch,
    name,
    manufacturer,
    manufacturing,
    expiry,
    quantity,
  } = req.body;

  if (
    !batch ||
    !name ||
    !manufacturer ||
    !manufacturing ||
    !expiry ||
    quantity === undefined ||
    quantity === null
  ) {
    return res.status(400).json({
      error: "All medicine fields are required.",
    });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO medicines
      (
        batch,
        name,
        manufacturer,
        manufacturing,
        expiry,
        quantity,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        batch.trim().toUpperCase(),
        name.trim(),
        manufacturer.trim(),
        manufacturing,
        expiry,
        Number(quantity),
        "Genuine",
      ]
    );

    res.status(201).json({
      id: result.insertId,
      batch: batch.trim().toUpperCase(),
      name: name.trim(),
      manufacturer: manufacturer.trim(),
      manufacturing,
      expiry,
      quantity: Number(quantity),
      status: "Genuine",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message,
    });
  }
});

// Delete medicine
app.delete("/api/medicines/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM medicines WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Medicine not found.",
      });
    }

    res.json({
      message: "Medicine deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// SHIPMENTS
// ===============================

// Get shipments
app.get("/api/shipments", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM shipments ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Add shipment
app.post("/api/shipments", async (req, res) => {
  const {
    batch,
    medicine,
    origin,
    destination,
  } = req.body;

  if (
    !batch ||
    !medicine ||
    !origin ||
    !destination
  ) {
    return res.status(400).json({
      error: "All shipment fields are required.",
    });
  }

  const id =
    `SHP-${Date.now().toString().slice(-5)}`;

  const updated =
    new Date().toLocaleString();

  try {
    await db.query(
      `
      INSERT INTO shipments
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
        id,
        batch,
        medicine,
        origin,
        destination,
        "In Transit",
        updated,
      ]
    );

    res.status(201).json({
      id,
      batch,
      medicine,
      origin,
      destination,
      status: "In Transit",
      updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE SHIPMENT STATUS
// ==========================================

app.put("/api/shipments/:id/status", async (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "In Transit",
    "Delayed",
    "Delivered",
  ];

  if (!status || !allowedStatuses.includes(status)) {

    return res.status(400).json({
      error:
        "Invalid status. Use In Transit, Delayed or Delivered.",
    });

  }

  try {

    const updated = new Date().toLocaleString();

    const [result] = await db.query(
      `
      UPDATE shipments
      SET status = ?, updated = ?
      WHERE id = ?
      `,
      [
        status,
        updated,
        id,
      ]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        error: "Shipment not found.",
      });

    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM shipments
      WHERE id = ?
      `,
      [id]
    );

    res.json(rows[0]);

  } catch (error) {

    console.error(
      "Shipment status update error:",
      error
    );

    res.status(500).json({
      error: error.message,
    });

  }

});

// ===============================
// ALERTS
// ===============================

// Get alerts
app.get("/api/alerts", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM alerts ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Add alert
app.post("/api/alerts", async (req, res) => {
  const {
    type,
    title,
    description,
    batch,
    location,
    time,
    icon,
  } = req.body;

  if (
    !type ||
    !title ||
    !description ||
    !batch ||
    !location ||
    !time ||
    !icon
  ) {
    return res.status(400).json({
      error: "All alert fields are required.",
    });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO alerts
      (
        type,
        title,
        description,
        batch,
        location,
        time,
        icon
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        type,
        title,
        description,
        batch,
        location,
        time,
        icon,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      type,
      title,
      description,
      batch,
      location,
      time,
      icon,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Acknowledge alert
app.delete("/api/alerts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM alerts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Alert not found.",
      });
    }

    res.json({
      message: "Alert acknowledged successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// VERIFY MEDICINE
// ===============================

app.post("/api/verify", async (req, res) => {
  const code =
    req.body.batch?.trim().toUpperCase();

  if (!code) {
    return res.status(400).json({
      type: "empty",
      message:
        "Enter a batch ID to begin verification.",
    });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM medicines
      WHERE UPPER(batch) = ?
      `,
      [code]
    );

    const medicine = rows[0];

    // =========================
    // BATCH NOT FOUND
    // =========================

    if (!medicine) {
      const [existingAlerts] =
        await db.query(
          `
          SELECT id
          FROM alerts
          WHERE batch = ?
          AND type = 'Critical'
          LIMIT 1
          `,
          [code]
        );

      if (existingAlerts.length === 0) {
        await db.query(
          `
          INSERT INTO alerts
          (
            type,
            title,
            description,
            batch,
            location,
            time,
            icon
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            "Critical",
            "Potential counterfeit batch detected",
            `Batch ${code} does not match any registered medicine record.`,
            code,
            "Verification Centre",
            new Date().toLocaleString(),
            "critical",
          ]
        );
      }

      return res.json({
        type: "suspicious",
        batch: code,
        message:
          "No registered medicine was found for this batch ID.",
      });
    }

    // =========================
    // EXPIRED
    // =========================

    if (medicine.status === "Expired") {
      const [existingAlerts] =
        await db.query(
          `
          SELECT id
          FROM alerts
          WHERE batch = ?
          AND type = 'Warning'
          LIMIT 1
          `,
          [medicine.batch]
        );

      if (existingAlerts.length === 0) {
        await db.query(
          `
          INSERT INTO alerts
          (
            type,
            title,
            description,
            batch,
            location,
            time,
            icon
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            "Warning",
            "Expired medicine identified",
            `Batch ${medicine.batch} has been identified as expired.`,
            medicine.batch,
            "Verification Centre",
            new Date().toLocaleString(),
            "warning",
          ]
        );
      }

      return res.json({
        type: "expired",
        batch: code,
        medicine,
        message:
          "This medicine batch has passed its expiry date.",
      });
    }

    // =========================
    // GENUINE
    // =========================

    return res.json({
      type: "genuine",
      batch: code,
      medicine,
      message:
        "This medicine batch is registered and verified.",
    });

  } catch (error) {
    console.error(
      "Verification error:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    `PharmaGuard backend running on http://localhost:${PORT}`
  );
});