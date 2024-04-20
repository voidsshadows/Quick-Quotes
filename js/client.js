const form = document.getElementById('quoteForm');
const quotesContainer = document.getElementById('quotesContainer');
const workerUrl = 'https://messaging.logodzip18.workers.dev';

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("quoteForm").addEventListener("submit", function(event) {
        // Check if turnstile verification is completed
        if (!window.turnstileVerified) {
            alert("Please complete the verification before submitting the form.");
            event.preventDefault(); // Prevent default form submission
        }
    });

    // Function to handle clearing form fields
    document.getElementById("clear").addEventListener("click", function() {
        document.getElementById("name").value = "";
        document.getElementById("quote").value = "";
    });
});


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const quote = document.getElementById('quote').value;
    
    if (!name || !quote) {
        console.error('Name or Quote is empty');
        return; // Don't proceed if name or quote is empty
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedQuote = sanitizeInput(quote);

    if (name !== sanitizedName || quote !== sanitizedQuote) {
        console.error('Sanitization detected. Refusing to submit.');
        return; // Don't proceed if sanitization detected
    }

    try {
        const response = await fetch(`${workerUrl}/kv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: sanitizedName, value: sanitizedQuote })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        form.reset();
        fetchAndDisplayAllQuotes(); // Fetch all quotes after adding a new one
    } catch (error) {
        console.error('Failed to submit quote:', error.message);
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
        console.error('Failed to fetch all quotes:', error.message);
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
    // Limit input to 100 characters and replace special characters with their HTML entities
    return input.substring(0, 100).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Fetch and display all quotes on page load
fetchAndDisplayAllQuotes();
