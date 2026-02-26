const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
console.log("ENV DATABASE_URL:", process.env.DATABASE_URL);
app.use(cors());
app.use(express.json());

// підключення до PostgreSQL через Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// створюємо таблицю, якщо її немає
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
createTable();

// API для збереження
app.post("/api/save", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO messages (data) VALUES ($1) RETURNING *",
      [req.body]
    );

    res.status(200).json({
      message: "Дані збережено у PostgreSQL",
      saved: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка збереження" });
  }
});

// API для отримання всіх записів
app.get("/api/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання даних" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// // дозволяємо запити тільки з конкретного фронтенд-домену
// app.use(cors({
//   origin: "http://127.0.0.1:5500" // тут твій фронтенд
// }));

// app.use(express.json());

// const filePath = path.join(__dirname, "data.json");

// app.post("/api/save", (req, res) => {
//   console.log("Отримані дані:", req.body);

//   let existingData = [];
//   if (fs.existsSync(filePath)) {
//     const fileContent = fs.readFileSync(filePath, "utf8");
//     if (fileContent) {
//       existingData = JSON.parse(fileContent);
//     }
//   }

//   existingData.push(req.body);

//   fs.writeFile(filePath, JSON.stringify(existingData, null, 3), (err) => {
//     if (err) {
//       console.error("Помилка при збереженні:", err);
//       return res.status(500).send("Помилка при збереженні");
//     }
//     res.status(200).send("Дані отримано та додано у data.json");
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Сервер запущено на http://localhost:${PORT}`)})
