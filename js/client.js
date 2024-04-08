const form = document.getElementById('quoteForm');
const quotesContainer = document.getElementById('quotesContainer');
const workerUrl = 'https://messaging.logodzip18.workers.dev';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = sanitizeInput(document.getElementById('name').value);
    const quote = sanitizeInput(document.getElementById('quote').value);

    try {
        const response = await fetch(`${workerUrl}/kv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: name, value: quote })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        form.reset();
        fetchAndDisplayAllQuotes(); // Fetch all quotes after adding a new one
    } catch (error) {
        console.error('Failed to submit quote:', error);
    }
});

async function fetchAndDisplayAllQuotes() {
    try {
        const response = await fetch(`${workerUrl}/kv/all`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quotes = await response.json();
        displayQuotes(quotes);
    } catch (error) {
        console.error('Failed to fetch all quotes:', error);
    }
}

function displayQuotes(quotes) {
    quotesContainer.innerHTML = ''; // Clear existing quotes
    quotes.forEach(quote => {
        displayQuote(quote.key, quote.value);
    });
}

function displayQuote(key, value) {
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `${sanitizeInput(key)}: ${sanitizeInput(value)}`;
    quotesContainer.appendChild(quoteElement);
}

function sanitizeInput(input) {
    // Replace HTML special characters with their entities to prevent XSS
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



// Fetch and display all quotes on page load
fetchAndDisplayAllQuotes();
