const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { parse } = require('json2csv');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// POST endpoint to handle the form submission
app.post('/submit-appointment', (req, res) => {
    const formData = req.body;

    // Convert the form data to CSV format
    const csv = parse([formData]);

    // Save the CSV file (optional, for debugging)
    fs.writeFileSync('appointment.csv', csv);

    // Setup email configuration (you will need to replace these with actual email credentials)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or other email services like Outlook, Yahoo, etc.
        auth: {
            user: 'your-email@gmail.com', // replace with your email
            pass: 'your-email-password', // replace with your email password or app-specific password
        },
    });

    // Email content
    const mailOptions = {
        from: 'your-email@gmail.com', // sender address
        to: '2145168658@example.com, precisionrepairstx@gmail.com', // recipients
        subject: 'New Appointment Request',
        text: 'A new appointment request has been submitted.',
        attachments: [
            {
                filename: 'appointment.csv',
                content: csv,
                encoding: 'utf-8',
            },
        ],
    };

    // Send the email with the CSV attachment
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
