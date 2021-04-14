const express = require("express");
const fortunes = require("./data/fortunes.json");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/fortunes", (req, res) => {
  res.json(fortunes);
});

app.get("/fortunes/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * fortunes.length);
  const randomFortune = fortunes[randomIndex];

  res.json(randomFortune);
});

app.get("/fortunes/:id", (req, res) => {
  const fortuneId = fortunes.find((f) => f.id == req.params.id);
  res.send(fortuneId);
});

const writeFortunes = (json) => {
  fs.writeFile("./data/fortunes.json", JSON.stringify(json), (err) =>
    console.log(err)
  );
};

app.post("/fortunes", (req, res) => {
  const { message, luckyNumber, spiritAnimal } = req.body;
  const fortunesId = fortunes.map((f) => f.id);
  const newFortunes = fortunes.concat({
    id: (fortunesId.length > 0 ? Math.max(...fortunesId) : 0) + 1,
    message,
    luckyNumber,
    spiritAnimal,
  });
  writeFortunes(newFortunes);
  res.send(newFortunes);
});

app.put("/fortunes/:id", (req, res) => {
  const oldFortune = fortunes.find((f) => f.id == req.params.id);
  const { message, luckyNumber, spiritAnimal } = req.body;
  if (message) oldFortune.message = message;
  if (luckyNumber) oldFortune.luckyNumber = luckyNumber;
  if (spiritAnimal) oldFortune.spiritAnimal = spiritAnimal;
  writeFortunes(fortunes);

  console.log(Array.isArray(req.body));
  res.send(fortunes);
});

app.delete("/fortunes/:id", (req, res) => {
  const newFortunes = fortunes.filter((f) => f.id != req.params.id);
  writeFortunes(newFortunes);
  res.send(newFortunes);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
