const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔐 Mongo URI
const mongoURI = process.env.MONGO_URI;

// =======================
// 🐾 PET SCHEMA
// =======================
const PetSchema = new mongoose.Schema({
  name: String,
  type: String,
  image: String
});

const Pet = mongoose.model("Pet", PetSchema);

// =======================
// 👤 USER SCHEMA
// =======================
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // 🚨 prevents duplicate users
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", UserSchema);

// =======================
// 📥 PET ROUTES
// =======================

// GET pets
app.get('/pets', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD pet
app.post('/pets', async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    await newPet.save();
    res.json(newPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE pet
app.delete('/pets/:id', async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 🔐 AUTH ROUTES
// =======================

// ✅ REGISTER
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🚨 Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🚨 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, password });
    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🚨 Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ❤️ HEALTH CHECK
// =======================
app.get('/', (req, res) => {
  res.send("🚀 Pet API is running");
});

// =======================
// 🚀 START SERVER
// =======================

const PORT = process.env.PORT || 3000;

if (!mongoURI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Connection Error:", err);
  });