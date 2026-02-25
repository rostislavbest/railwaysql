







const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// дозволяємо запити тільки з конкретного фронтенд-домену
app.use(cors({
  origin: "http://127.0.0.1:5500" // тут твій фронтенд
}));

app.use(express.json());

const filePath = path.join(__dirname, "data.json");

app.post("/api/save", (req, res) => {
  console.log("Отримані дані:", req.body);

  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    if (fileContent) {
      existingData = JSON.parse(fileContent);
    }
  }

  existingData.push(req.body);

  fs.writeFile(filePath, JSON.stringify(existingData, null, 3), (err) => {
    if (err) {
      console.error("Помилка при збереженні:", err);
      return res.status(500).send("Помилка при збереженні");
    }
    res.status(200).send("Дані отримано та додано у data.json");
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`)})