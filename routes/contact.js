const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 
const Brevo = require('@getbrevo/brevo'); // 🌟 Import the official Brevo SDK

router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Save to MongoDB (This works fine!)
        const newContact = new Contact({ name, email, message });
        await newContact.save(); 

        // 2. Initialize Brevo API client using your existing SMTP API key
        let defaultClient = Brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.EMAIL_PASS; // Your Brevo Master API Key

        let apiInstance = new Brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new Brevo.SendSmtpEmail();

        // 3. Configure the HTTP API Payload
        sendSmtpEmail.subject = `New Contact Message from ${name}`;
        sendSmtpEmail.htmlContent = `
            <h3>You have a new message from your portfolio:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        `;
        sendSmtpEmail.sender = { "name": "Portfolio Contact Form", "email": process.env.EMAIL_USER };
        sendSmtpEmail.to = [{ "email": process.env.RECEIVER_EMAIL }];

        // 4. Send the Email over standard HTTPS API (Bypasses Render's firewall block)
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        // 5. Send Success back to React
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