window.addEventListener("load", function() {
    var loadingScreen = document.querySelector(".loadingScreen");
    loadingScreen.classList.add("fade-out");

    setTimeout(function() {
        loadingScreen.style.display = "none";

        document.body.classList.remove("no-scroll");
    }, 500);
});

document.body.classList.add("no-scroll");