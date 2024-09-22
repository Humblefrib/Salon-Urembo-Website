document.addEventListener('DOMContentLoaded', () => {
    const cartDataInput = document.getElementById('cartDataInput');
    let products = []; // Array to store product details

    // Fetch the products data (assuming it's the same JSON file used in the main page)
    fetch('shoppingProducts.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            populateCartDetails();
        })
        .catch(error => console.error('Error fetching products:', error));

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

    // Handle form submission
    // document.querySelector('.appointmentContainerDetails').addEventListener('submit', (event) => {
    //     event.preventDefault();
        
    //     addCartToMemory(); 
        
    //     alert('Cart details have been sent and saved to memory!');
    // });
});