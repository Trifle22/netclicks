// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

//открытие/закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});
document.addEventListener('click', event => {
    const target = event.target;
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});
leftMenu.addEventListener('click', () => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});
// vard change on hover
const card = document.querySelectorAll('.tv-card');
let cardImg = document.querySelectorAll('.tv-card__img');
cardImg.forEach(function(elem) {
    let imgSrc = elem.getAttribute('src');
    let imgData = elem.getAttribute('data-backdrop');
    elem.addEventListener('mousemove', () => {
        elem.setAttribute('src', imgData);
    });
    elem.addEventListener('mouseout', () => {
        elem.setAttribute('src', imgSrc);
    });
});