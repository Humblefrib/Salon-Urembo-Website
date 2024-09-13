import {products} from "./products.js";

const cart = () => {
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let checkOutBtn = document.querySelector('.checkOut');
    let clearCartBtn = document.querySelector('.clearCartBtn');
    let notifyEmptyList = document.querySelector('.notifyEmptyList');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let cart = [];

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.removeItem('cart');
        addCartToHTML();
    });

    // Toggles the side-menue
    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });

    checkOutBtn.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });

    const setProductInCart = (idProduct, value) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == idProduct);

        if(value <= 0) {
            cart.splice(positionThisProductInCart, 1);
        }
        else if(positionThisProductInCart < 0) {
            cart.push({
                product_id: idProduct,
                quantity: 1
            });
        }
        else {
            cart[positionThisProductInCart].quantity = value;
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        addCartToHTML();
    };

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if(cart.length > 0) {
            cart.forEach(item => {
                totalQuantity = totalQuantity + item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image"><img src="${info.image}"></div>

                <div class="name">${info.name}</div>

                <div class="totalPrice">R${info.price * item.quantity}</div>

                <div class="quantity">
                    <span class="minus" data-id="${info.id}">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus" data-id="${info.id}">+</span>
                </div>
                `;
            });
        }

        iconCartSpan.innerText = totalQuantity;

        if(cart.length > 0) {
            clearCartBtn.classList.remove('hidden');
            notifyEmptyList.classList.add('hidden');
        }
        else if(cart.length <= 0) {
            clearCartBtn.classList.add('hidden');
            notifyEmptyList.classList.remove('hidden');
        }
    };

    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        let quantity = null;
        let positionProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        switch(true) {
            case(buttonClick.classList.contains('addCart')):
                quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;

            case(buttonClick.classList.contains('minus')):
                quantity = cart[positionProductInCart].quantity - 1;
                setProductInCart(idProduct, quantity);
                break;

            case(buttonClick.classList.contains('plus')):
                quantity = cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;

            default:
                break;
        }
    });

    const initApp = () => {
        if(localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    };

    initApp();

    // Handle button press to submit the form
    document.getElementById('submitCartButton').addEventListener('click', function () {
        let cartData = JSON.parse(localStorage.getItem('cart')) || [];

            // Prepare product details (name and quantity) for submission
            let productDetails = cartData.map(item => {
                let product = products.find(product => product.id == item.product_id);
                return `${product.name}: ${item.quantity}`;
            }).join(', ');

            // Get the hidden input fields
            let cartDataInput = document.getElementById('cartData');
            let productDetailsInput = document.getElementById('productDetails');

            // Set the hidden input values
            cartDataInput.value = JSON.stringify(cartData); // Serialize cart data
            productDetailsInput.value = productDetails; // Product name and quantity string

            // Submit the form programmatically
            document.getElementById('cartForm').submit();
    });
};

export default cart;
