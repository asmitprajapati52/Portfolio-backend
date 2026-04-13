const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 
const nodemailer= require('nodemailer');

// This handles the POST request from your React Contact.jsx
router.post('/contact', async (req, res) => {
    try {
        const {name,email, message}=req.body;

        const newContact = new Contact({name,email, message});
        await newContact.save(); 
        
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // TLS on port 587 requires this to be false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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
    console.log("CRITICAL ERROR DETAILS:", error);
    // Send this back so React knows to show the "Error" message
    res.status(500).json({ success: false, message: "Internal Server Error" });
}
});

module.exports = router;