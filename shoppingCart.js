let emptyCartNotify = document.querySelector('.emptyCartNotify');
let listProductHTML = document.querySelector('.listProduct');
let iconCartSpan = document.querySelector('.icon-cart span');
let listCartHTML = document.querySelector('.listCart');
let clearCart = document.querySelector('.clearCart');
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let nav = document.querySelector("nav");
let selectedPriceRange = 'all';
let selectedCategory = 'all';
let sortType = 'name';
let products = [];
export let cart = [];
let sortNameOrder = 'none';

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
    nav.classList.toggle("hidden");
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
    nav.classList.toggle("hidden");
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    let filteredProducts = products;

    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProducts = products.filter(product => product.category === selectedCategory);
    }

    // Handle price range and sorting
    if (selectedPriceRange !== 'all') {
        if (selectedPriceRange === 'price-asc') {
            // Sort by price: Low to High
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (selectedPriceRange === 'price-desc') {
            // Sort by price: High to Low
            filteredProducts.sort((a, b) => b.price - a.price);
        } else {
            // Filter by specific price ranges
            filteredProducts = filteredProducts.filter(product => {
                const price = product.price;
                if (selectedPriceRange === '0-50') return price >= 0 && price <= 50;
                if (selectedPriceRange === '50-100') return price > 50 && price <= 100;
                if (selectedPriceRange === '100-200') return price > 100 && price <= 200;
                if (selectedPriceRange === '200') return price > 200;
            });
        }
    }

    // Sort by name (if applicable)
    if (sortNameOrder === 'name-asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); // A to Z
    } else if (sortNameOrder === 'name-desc') {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); // Z to A
    }

    // Render the products to the HTML
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">R${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    } else {
        let noProductsMessage = document.createElement('div');
        noProductsMessage.classList.add('no-products');
        noProductsMessage.innerHTML = `<span>Oops! No products available in this category.</span>`;
        listProductHTML.appendChild(noProductsMessage);
    }
}

// document.getElementById('sortName').addEventListener('click', () => {
//     sortType = 'name';
//     addDataToHTML();
// });

document.getElementById('sortName').addEventListener('change', (event) => {
    sortNameOrder = event.target.value; // Set sorting order
    addDataToHTML();
});

document.getElementById('categoryFilter').addEventListener('change', (event) => {
    selectedCategory = event.target.value;
    addDataToHTML();
});

document.getElementById('priceFilter').addEventListener('change', (event) => {
    selectedPriceRange = event.target.value;
    addDataToHTML();
});

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if(positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;

        addToCart(id_product);
    }
});

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
    else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }

    addCartToHTML();
    addCartToMemory();
}

export const addCartToMemory = () => {
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

            totalQuantity = totalQuantity + item.quantity;
            newItem.classList.add('item');
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

    addCartToMemory();
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
        addCartToMemory();
    }
});

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

                if(changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }
                else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }

    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    fetch('shoppingProducts.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        if(localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    .catch(error => {
        console.error('Error fetching the products:', error);
    });
}

initApp();

clearCart.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem('cart');

    addCartToHTML();
    addCartToMemory();
});

const checkoutButton = document.querySelector('.checkOut');

checkoutButton.addEventListener('click', () => {
    addCartToMemory(); // Save cart data to localStorage
    window.location.href = 'index.html'; // Redirect to form page (update the path as needed)
});