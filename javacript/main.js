const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
API_KEY = 'aa8cc5268ed1b8f9383f996d3cb2c248';
// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list')
tvShows = document.querySelector('.tv-shows');
modal = document.querySelector('.modal');
const loading = document.createElement('div');
loading.className = 'loading';
tvCardImg = document.querySelector('.tv-card__img');
modalTitle = document.querySelector('.modal__title');
genresList = document.querySelector('.genres-list');
rating = document.querySelector('.rating');
description = document.querySelector('.description');
modalLink = document.querySelector('.modal__link');
searchForm = document.querySelector('.search__form');
searchFormInput = document.querySelector('.search__form-input');

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
    getTestCard = () => {
        return this.getData('card.json');
    }
    getSearchResult = query => this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);
    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);

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
        const voteElem = vote ? ` < span class = 'tv-card__vote' > $ { vote } < /span>` : '';

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
        loading.remove();
        tvShowsList.append(card);
    })

};
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

//окрытие/закрытие меню
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
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {
        new DBService().getTestCard()
            .then(data => {
                console.log(data);
                tvCardImg.src = IMG_URL + data.poster_path;
                modalTitle.textContent = data.name;
                /* genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, ''); */
                genresList.textContent = '';
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating
                description
                modalLink

            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
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