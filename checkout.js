// Select the cart items container and cart icon
const cartTable = document.querySelector('.cart-page table');
const totalPriceElement = document.querySelector('.total-price td:last-child');
const iconCartSpan = document.querySelector('.icon-cart span'); // For cart item count display
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
const cartDataInput = document.getElementById('cartDataInput');

// Fetch product data (same as in shop.js)
fetch('shoppingProducts.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        populateCheckout();
        updateCartIconQuantity(); // Initial update of cart icon quantity
        populateCartDetails();
    })
    .catch(error => {
        console.error('Error fetching the products:', error);
    });

// Function to populate the checkout page with cart items
function populateCheckout() {
    // Clear previous items
    const existingRows = cartTable.querySelectorAll("tr.item-row");
    existingRows.forEach(row => row.remove());

    // If cart is empty, show empty cart notification and hide the table
    if (cart.length === 0) {
        document.querySelector('.emptyCartNotify').classList.remove('hidden');
        return;
    } else {
        document.querySelector('.emptyCartNotify').classList.add('hidden');
    }

    let totalAmount = 0;

    cart.forEach(item => {
        // Find the product details by ID
        const product = products.find(prod => prod.id == item.product_id);
        if (product) {
            // Calculate subtotal for each product
            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            // Create a row for the product in the table
            const row = document.createElement('tr');
            row.classList.add("item-row");
            row.innerHTML = `
                <td>
                    <div class="cart-info">
                        <img src="${product.image}" alt="${product.name}">
                        <div>
                            <p>${product.name}</p>
                            <small>Price: R${product.price}</small>
                            <button class="removeItemBtn" data-id="${item.product_id}">Remove <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e8eaed"><path d="M360-640v-80h240v80H360ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/></svg></button>
                        </div>
                    </div>
                </td>
                <td>
                    <button class="quantityBtn decrease" data-id="${item.product_id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantityBtn increase" data-id="${item.product_id}">+</button>
                </td>
                <td>R${subtotal.toFixed(2)}</td>
            `;
            cartTable.appendChild(row);
        }
    });

    // Calculate tax and total
    const tax = totalAmount * 0.15; // Assume 15% tax
    const finalTotal = totalAmount + tax;

    // Update the subtotal, tax, and total in the HTML
    const subtotalRow = document.querySelector('.total-price table tr:nth-child(1) td:last-child');
    const taxRow = document.querySelector('.total-price table tr:nth-child(2) td:last-child');
    const totalRow = document.querySelector('.total-price table tr:nth-child(3) td:last-child');

    subtotalRow.textContent = `R${totalAmount.toFixed(2)}`;
    taxRow.textContent = `R${tax.toFixed(2)}`;
    totalRow.textContent = `R${finalTotal.toFixed(2)}`;

    // Add event listeners for each increase/decrease button
    document.querySelectorAll('.quantityBtn.increase').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;

            changeQuantity(productId, 'increase');
        });
    });

    document.querySelectorAll('.quantityBtn.decrease').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;

            changeQuantity(productId, 'decrease');
        });
    });

    // Add event listeners for each remove button
    document.querySelectorAll('.removeItemBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            removeItemFromCart(productId);
        });
    });
}

// Function to change the quantity of a specific item in the cart
function changeQuantity(productId, action) {
    const itemIndex = cart.findIndex(item => item.product_id === productId);

    if (itemIndex !== -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        populateCheckout(); // Refresh the checkout page to reflect changes
        updateCartIconQuantity(); // Update cart icon quantity after change
        populateCartDetails();
    }
}

// Function to remove a specific item from the cart
function removeItemFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    populateCheckout(); // Refresh the checkout page to reflect changes
    populateCartDetails();
    updateCartIconQuantity(); // Update cart icon quantity after removal
}

// Function to update the cart icon quantity display
function updateCartIconQuantity() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    iconCartSpan.textContent = totalQuantity;
}

const populateCartDetails = () => {
    let cartMessage = '';

    // Retrieve cart data from localStorage
    let storedCart = JSON.parse(localStorage.getItem('cart'));

    if (storedCart && storedCart.length > 0) {
        storedCart.forEach(item => {
            const product = products.find(prod => prod.id == item.product_id);
            if (product) {
                cartMessage += `${product.name} - Price: R${product.price}, Quantity: ${item.quantity}\n .`;
            }
        });
    } else {
        cartMessage = 'Your cart is empty.';
    }

    // Populate the input field with cart details
    cartDataInput.value = cartMessage;
};

// Initial call to update the cart icon quantity on page load
updateCartIconQuantity();