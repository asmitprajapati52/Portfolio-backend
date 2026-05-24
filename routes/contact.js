const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 

router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Save to MongoDB (Working fine)
        const newContact = new Contact({ name, email, message });
        await newContact.save(); 

        // 2. Prepare payload for Brevo API v3
        const emailData = {
            sender: { 
                name: "Portfolio Contact Form", 
                email: process.env.EMAIL_USER.trim() // Clear accidental trailing spaces
            },
            to: [
                { 
                    email: process.env.RECEIVER_EMAIL.trim()
                }
            ],
            subject: `New Contact Message from ${name}`,
            htmlContent: `
                <h3>You have a new message from your portfolio:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // 3. Make HTTP request with standard case headers
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'api-key': process.env.EMAIL_PASS.trim(), 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        // 4. Send Success Response back to React if Brevo returns 201 Created / 200 OK
        if (brevoResponse.ok) {
            return res.status(200).json({ 
                success: true, 
                message: "Message Sent Successfully! 🚀" 
            });
        } else {
            const errorData = await brevoResponse.json();
            console.error("BREVO REJECTION LOGS:", errorData);
            throw new Error(errorData.message || "Brevo failed to process transfer");
        }

    } catch (error) {
        console.error("CRITICAL ERROR DETAILS:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

module.exports = router;