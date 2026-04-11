const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 
const nodemailer= require('nodemailer');

// This handles the POST request from your React Contact.jsx
router.post('/', async (req, res) => {
    try {
        const {name,email, message}=req.body;

        const newContact = new Contact({name,email, message});
        await newContact.save(); 

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:process.env.EMAIL_USER, 
                pass:process.env.EMAIL_PASS
            }
        });

        const mailOptions={
            from: process.env.EMAIL_USER,
            to:process.env.RECEIVER_EMAIL,
            subject: `New Contact Message from ${name}`,
            text: `You have a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
        }

       await transporter.sendMail(mailOptions);

        // --- IS LINE KO ADD KARO ---
        res.status(200).json({ success: true, message: "Message Sent Successfully! 🚀" });
        // ---------------------------

    } catch (error) {
        console.log("CRITICAL ERROR DETAILS:", {
            message: error.message,
            code: error.code
        });     // ... rest of your catch code
}
});

module.exports = router;