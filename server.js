const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔐 ENV Mongo URI
const mongoURI = process.env.MONGO_URI;

// 🧠 Schema
const PetSchema = new mongoose.Schema({
  name: String,
  type: String,
  image: String
});

// 📦 Model
const Pet = mongoose.model("Pet", PetSchema);

// 📥 GET all pets
app.get('/pets', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📤 POST new pet
app.post('/pets', async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    await newPet.save();
    res.json(newPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ DELETE pet
app.delete('/pets/:id', async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❤️ Health route
app.get('/', (req, res) => {
  res.send("🚀 Pet API is running");
});

// 🚀 Start server AFTER DB connects
async function start() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

start();