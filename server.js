const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection String
const mongoURI = "mongodb://siyamishra15:akshay2005@ac-ejj9k8t-shard-00-00.9epyd5x.mongodb.net:27017,ac-ejj9k8t-shard-00-01.9epyd5x.mongodb.net:27017,ac-ejj9k8t-shard-00-02.9epyd5x.mongodb.net:27017/petDB?ssl=true&replicaSet=atlas-uubokv-shard-0&authSource=admin&retryWrites=true&w=majority";

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

// ❌ DELETE pet (CORRECT PLACE)
app.delete('/pets/:id', async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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