const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 

router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Save to MongoDB (Works perfectly)
        const newContact = new Contact({ name, email, message });
        await newContact.save(); 

        // 2. Prepare payload for Brevo API v3
        const emailData = {
            sender: { 
                name: "Portfolio Contact Form", 
                email: process.env.EMAIL_USER // Your authenticated Brevo sender email
            },
            to: [
                { 
                    email: process.env.RECEIVER_EMAIL // Your target inbox email
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

        // 3. Make HTTP request directly to Brevo over secure HTTPS port 443
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.EMAIL_PASS, // Your v3 API Key stored in Render
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const responseData = await brevoResponse.json();

        // If Brevo API returns an error structure
        if (!brevoResponse.ok) {
            console.error("Brevo API Rejected Email Request:", responseData);
            throw new Error(responseData.message || "Brevo delivery failed");
        }

        // 4. Send Success Response back to React
        return res.status(200).json({ 
            success: true, 
            message: "Message Sent Successfully! 🚀" 
        });

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