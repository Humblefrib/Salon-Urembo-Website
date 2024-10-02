let navSvg = document.querySelector('.navSvg');
let dropDownMenu = document.querySelector(".dropDownMenu");

navSvg.addEventListener('click', () => {
    dropDownMenu.classList.toggle('active');
});