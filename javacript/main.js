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
// card change on hover
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
// открытие модального окна
tvShowsList = document.querySelector('.tv-shows__list');
modal = document.querySelector('.modal');
tvShowsList.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});
// закрытие
modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');

    }
});
class Human