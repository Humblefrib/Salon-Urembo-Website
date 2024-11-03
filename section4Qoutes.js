const quotes = document.querySelectorAll('.quote');
let currentQuoteIndex = 0;
const counter = document.getElementById('counter');
const totalQuotes = quotes.length;

function updateCounter() {
    counter.textContent = `${currentQuoteIndex + 1}/${totalQuotes}`;
}

document.getElementById('nexter').addEventListener('click', () => {
    quotes[currentQuoteIndex].classList.remove('active');
    quotes[currentQuoteIndex].classList.add('prev-active');
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quotes[currentQuoteIndex].classList.add('active');
    updateCounter();

    setTimeout(() => {
        quotes.forEach(quote => quote.classList.remove('prev-active'));
    }, 500);
});

document.getElementById('previous').addEventListener('click', () => {
    quotes[currentQuoteIndex].classList.remove('active');
    quotes[currentQuoteIndex].classList.add('prev-active');
    currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
    quotes[currentQuoteIndex].classList.add('active');
    updateCounter();

    setTimeout(() => {
        quotes.forEach(quote => quote.classList.remove('prev-active'));
    }, 500);
});

updateCounter();