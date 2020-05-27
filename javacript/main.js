const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
API_KEY = 'aa8cc5268ed1b8f9383f996d3cb2c248';
// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list')

//cards

const DBService = class {
    getData = async(url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);

        }

    }
    getTestData = () => {
        return this.getData('test.json')
    }
}
const renderCard = response => {
    console.log(response);
    tvShowsList.textContent = '';
    response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
        } = item;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = poster ? IMG_URL + backdrop : 'img/no-poster.jpg';
        const voteElem = vote ? `<span class='tv-card__vote'>${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
        <a href="#" class="tv-card">
              ${voteElem}
              <img class="tv-card__img" 
              src="${posterIMG}" 
              data-backdrop="${backdropIMG}" 
              alt="${title}">
              <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        tvShowsList.append(card);
    })

};
new DBService().getTestData().then(renderCard);

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
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
    }
};
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);

// открытие модального окна
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