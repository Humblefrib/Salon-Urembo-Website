const checkoutElements = document.querySelectorAll('.checkOut');
    
// Add a click event listener to each of them
checkoutElements.forEach(function(element) {
    element.addEventListener('click', function() {
        console.log('Checkout button clicked!');
    });
});