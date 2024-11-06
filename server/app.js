const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.EXCHANGERATE_API_KEY;

app.use(express.static(path.join(__dirname, '../'))); // Umożliwia serwowanie plików front-endowych

// Endpoint do pobrania kursów walut w czasie rzeczywistym
app.get('/api/rates', async (req, res) => {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Błąd pobierania danych kursów walut' });
    }
});

// Endpoint do pobrania danych historycznych
app.get('/api/history/:currency', async (req, res) => {
    const currency = req.params.currency;
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/history/${currency}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Błąd pobierania danych historycznych' });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
