// server.js
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database: ', db.threadId);
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, Patients) => {
        if (err) {
            return res.status(500).send("Failed to get Patients", err);
        }
        res.status(200).render('Patients', { Patients });
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, Providers) => {
        if (err) {
            return res.status(500).send("Failed to get Providers", err);
        }
        res.status(200).render('Providers',{ Providers});
    });
});

// 3. Filter patients by First Name
app.get('/patients/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const query = "SELECT * FROM patients WHERE first_name = 'Far'";
    db.query(query, [firstName], (err, PatientFirstName) => {
        if (err) {
            return res.status(500).send("Failed to get providers First Name", err);
        }
        res.status(200).render('PatientFirstName',{ PatientFirstName});
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const query = "SELECT provider_id, first_name, last_name,provider_specialty FROM providers WHERE provider_specialty = 'Pediatrics'";
    db.query(query, [specialty], (err, ProviderSpecialty) => {
        if (err) {
            return res.status(500).send("Failed to get Provider by specialty", err);
        }
        res.status(200).render('ProviderSpecialty',{ ProviderSpecialty});
    });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
