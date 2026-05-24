const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 
const nodemailer = require('nodemailer');

router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Save to Database
        const newContact = new Contact({ name, email, message });
        await newContact.save(); 
        
       // 2. Configure Nodemailer Transporter (Updated to secure port 465)
    const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 465,            // 🌟 CHANGED from 587 to 465
    secure: true,         // 🌟 CHANGED from false to true (465 requires secure: true)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
        // 3. Define Email Structure
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `New Contact Message from ${name}`,
            text: `You have a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        // 4. Send Email
        await transporter.sendMail(mailOptions);

        // 5. Send Success Response back to React and RETURN to prevent double responding
        return res.status(200).json({ 
            success: true, 
            message: "Message Sent Successfully! 🚀" 
        });

    } catch (error) {
        console.error("CRITICAL ERROR DETAILS:", error);
        
        // Return error response so React safely drops out of the loading state
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

module.exports = router;