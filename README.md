# Portfolio API Backend

The engine behind the portfolio, handling data persistence and automated communication.

## ⚙️ Core Functionality
- **Data Persistence**: Stores contact messages in **MongoDB Atlas**.
- **Email Automation**: Uses **Nodemailer** to send real-time notifications to the admin via Gmail SMTP.
- **Security**: Implements environment variable protection and CORS policy.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Communication**: Nodemailer
- **Environment**: Dotenv

## 🔐 Environment Variables
To run this server, you will need to add the following variables to your `.env` file:
- `PORT`
- `MONGO_URI`
- `EMAIL_USER`
- `EMAIL_PASS` (Google App Password)
- `RECEIVER_EMAIL`

## 📦 Installation
1. `cd server`
2. `npm install`
3. `npm start`