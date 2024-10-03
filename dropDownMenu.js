let navSvg = document.querySelector('.navSvg');
let dropDownMenu = document.querySelector(".dropDownMenu");
let navLinks = document.querySelectorAll(".dropDownMenu div");

navSvg.addEventListener('click', () => {
    dropDownMenu.classList.toggle('active');
});

navLinks.forEach(navLink => {
    navLink.addEventListener("click", () => {
        dropDownMenu.classList.toggle('active');
    });
})
