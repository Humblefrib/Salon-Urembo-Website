let emptyCartNotify = document.querySelector('.emptyCartNotify');
let listProductHTML = document.querySelector('.listProduct');
let iconCartSpan = document.querySelector('.icon-cart span');
let listCartHTML = document.querySelector('.listCart');
let clearCart = document.querySelector('.clearCart');
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const addDataToHTML = () => {
    if(products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');

            newProduct.dataset.id = product.id;
            newProduct.classList.add('Item');
            newProduct.innerHTML = `
                <img src="${product.image}">
                <h2>${product.name}</h2>
                <div class="price">R${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;

            listProductHTML.appendChild(newProduct);
        });
    }
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if(positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;

        addToCart(id_product);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);

    if(cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }
    else if(positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }
    else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }

    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    let totalQuantity = 0;

    listCartHTML.innerHTML = '';

    if(cart.length > 0) {
        cart.forEach(item => {
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let newItem = document.createElement('div');
            let info = products[positionProduct];

            totalQuantity = totalQuantity +  item.quantity;

            newItem.classList.add('Item');
            newItem.dataset.id = item.product_id;
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">R${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
        })
    }

    iconCartSpan.innerText = totalQuantity;

    if(cart.length > 0) {
        emptyCartNotify.classList.add("hidden");
        clearCart.classList.remove("hidden");
    }
    else {
        emptyCartNotify.classList.remove("hidden");
        clearCart.classList.add("hidden");
    }
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';

        if(positionClick.classList.contains('plus')) {
            type = 'plus';
        }

        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch(type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }
                else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }

    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
}

initApp();

clearCart.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem('cart');

    addCartToHTML();
    addCartToMemory();
})

let selectedProducts = []; // To store the selected product details

// Select elements inside the detailContainer where you will replace the image, name, and price
let detailImage = document.querySelector('.detailContainer .image img');
let detailName = document.querySelector('.detailContainer .name');
let detailPrice = document.querySelector('.detailContainer .price');

listProductHTML.addEventListener('click', (event) => {
    let clickedElement = event.target;

    // Check if the clicked element is a product (based on class or element type)
    if (clickedElement.classList.contains('Item') || clickedElement.closest('.Item')) {
        let productElement = clickedElement.closest('.Item'); // Get the product container

        // Extract details (image, name, and price)
        let productImage = productElement.querySelector('img').src;
        let localImagePath = productImage.replace(window.location.origin, ''); // Get local path

        let productName = productElement.querySelector('h2').innerText;
        let productPrice = productElement.querySelector('.price').innerText;

        // Reset the array and store the new product
        selectedProducts = [{
            image: localImagePath,
            name: productName,
            price: productPrice
        }];

        // Log the updated list of selected products
        console.log(selectedProducts);

        // Update the detailContainer div with the new product details
        updateDetailContainer();
    }
});

// Function to update the detailContainer with the selected product details
const updateDetailContainer = () => {
    if (selectedProducts.length > 0) {
        const product = selectedProducts[0]; // Get the latest selected product

        // Update the image, name, and price in the detailContainer
        detailImage.src = product.image;
        detailName.innerText = product.name;
        detailPrice.innerText = product.price;
    }
};
