// Pobieranie aktualnych kursów walut
async function fetchRates() {
    try {
        const response = await fetch('https://your-heroku-app.herokuapp.com/api/rates');
        const data = await response.json();
        displayRates(data);
        populateCurrencySelectors(data);
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
    }
}

// Wyświetlanie kursów
function displayRates(data) {
    const ratesContainer = document.getElementById('currentRates');
    ratesContainer.innerHTML = '<h3>Aktualne kursy względem USD:</h3>';
    for (const [currency, rate] of Object.entries(data.conversion_rates)) {
        ratesContainer.innerHTML += `<p>${currency}: ${rate}</p>`;
    }
}

// Wypełnianie selektorów walut
function populateCurrencySelectors(data) {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    Object.keys(data.conversion_rates).forEach(currency => {
        fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
        toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
    });
}

// Kalkulator walutowy
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const response = await fetch('https://your-heroku-app.herokuapp.com/api/rates');
    const data = await response.json();
    const result = (amount * data.conversion_rates[toCurrency] / data.conversion_rates[fromCurrency]).toFixed(2);
    document.getElementById('result').textContent = `Wynik: ${result} ${toCurrency}`;
}

// Pobieranie i wyświetlanie danych historycznych
async function fetchHistory() {
    const response = await fetch('https://your-heroku-app.herokuapp.com/api/history/USD');
    const data = await response.json();
    const labels = Object.keys(data.rates);
    const values = Object.values(data.rates).map(rate => rate['EUR']); // Przykład EUR

    const ctx = document.getElementById('currencyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kurs USD/EUR',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

fetchRates();
fetchHistory();
