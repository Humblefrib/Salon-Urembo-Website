let emptyCartNotify = document.querySelector('.emptyCartNotify');
let listProductHTML = document.querySelector('.listProduct');
let iconCartSpan = document.querySelector('.icon-cart span');
let listCartHTML = document.querySelector('.listCart');
let clearCart = document.querySelector('.clearCart');
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let nav = document.querySelector("nav");
let products = [];
let cart = [];

let checkoutBtn = document.querySelector(".detail .buttons button:nth-child(1)");
let actualCheckOutBtn = document.querySelector(".actualCheckOutBtn");

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
    nav.classList.toggle("hidden");
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
    nav.classList.toggle("hidden");
});
checkoutBtn.addEventListener('click', () => {
    body.classList.toggle('showCart');
    nav.classList.toggle("hidden");
});
actualCheckOutBtn.addEventListener('click', () => {
    nav.classList.toggle("hidden");
});

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
        addToCart(positionClick.parentElement.dataset.id);
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

let cartDataInput = document.querySelector("#cartDataInput");

const updateCartForm = () => {
    let cartData = [];

    if(cart.length > 0) {
        cart.forEach(item => {
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let product = products[positionProduct];

            cartData.push(`Product: ${product.name}, Price: R${product.price}, Quantity: ${item.quantity}`);
        });

        cartDataInput.value = cartData.join('; ');
    }
    else {
        cartDataInput.value = "";
    }
}

document.querySelector('.actualCheckOutBtn').addEventListener('click', function(event) {
    if(cart.length === 0) {
        alert("Your cart is empty.");
        event.preventDefault();
        nav.classList.toggle("hidden");
    }
    else {
        updateCartForm();
        body.classList.toggle('showCart');
    }
});

const addCartToHTML = () => {
    let totalQuantity = 0;

    listCartHTML.innerHTML = '';

    if(cart.length > 0) {
        cart.forEach(item => {
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let newItem = document.createElement('div');
            let info = products[positionProduct];

            totalQuantity += item.quantity;

            newItem.classList.add('Item');
            newItem.dataset.id = item.product_id;
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>

                <div class="name">${info.name}</div>

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

    updateCartForm();
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
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    if(positionItemInCart >= 0){
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
        })
        .catch(error => console.error("Failed to load products:", error));
}

initApp();

clearCart.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem('cart');

    addCartToHTML();
    addCartToMemory();
});

let selectedProducts = [];
let detailImage = document.querySelector('.detail1 img');
let detailName = document.querySelector('.detail2 .name');
let detailPrice = document.querySelector('.detail2 .price');
let detailDescription = document.querySelector('.detail2 .description');

listProductHTML.addEventListener('click', (event) => {
    let clickedElement = event.target;

    if(clickedElement.classList.contains('Item') || clickedElement.closest('.Item')) {
        let productElement = clickedElement.closest('.Item');
        let productId = productElement.dataset.id;
        let selectedProduct = products.find(product => product.id == productId);

        if(selectedProduct) {
            selectedProducts = [{
                image: selectedProduct.image,
                name: selectedProduct.name,
                price: `R${selectedProduct.price}`,
                description: selectedProduct.description
            }];

            detailImage.src = selectedProducts[0].image;
            detailName.innerText = selectedProducts[0].name;
            detailPrice.innerText = selectedProducts[0].price;
            detailDescription.innerText = selectedProducts[0].description;
        }
    }
});

let detailAddCartBtn = document.querySelector(".detail .buttons button:nth-child(2)");

detailAddCartBtn.addEventListener('click', () => {
    if (selectedProducts.length > 0) {
        let product_id = products.find(product => product.name === selectedProducts[0].name).id;

        addToCart(product_id);
    }
});
