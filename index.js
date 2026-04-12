require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');     


// Import Routes
const contactRoutes = require('./routes/contact');

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://portfolio-frontend-five-olive.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());
// Routes Mounting
// This connects the logic in your routes folder to the /api/contact URL
app.use('/api', contactRoutes);

// Basic Test Route
app.get('/', (req, res) => {
    res.send("Asmit's Portfolio Server is Running!");
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000; 

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully ✅");
        app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
    })
    .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    });