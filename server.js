const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔐 Use ENV variable (IMPORTANT for cloud)
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

// ❤️ Health check (VERY useful for Render)
app.get('/', (req, res) => {
  res.send("🚀 Pet API is running");
});

// 🚀 Start Server AFTER DB connects
async function start() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });

  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

start();