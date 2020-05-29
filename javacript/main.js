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
preLoader = document.querySelector('.preloader');
dropDown = document.querySelectorAll('.dropdown');
TvShowsHead = document.querySelector('.tv-shows__head');
posterWrapper = document.querySelector('.poster__wrapper');
modalContent = document.querySelector('.modal__content');
class DBService {
    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = 'aa8cc5268ed1b8f9383f996d3cb2c248';
    }
    getData = async(url) => {
        tvShows.append(loading);
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
    getSearchResult = query => this
        .getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);
    getTvShow = id => this
        .getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    getToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
}
const dbService = new DBService();
const renderCard = (response, target) => {
    tvShowsList.textContent = '';
    console.log(response);
    if (!response.total_results) {
        loading.remove();
        TvShowsHead.textContent = 'Ничего не найдено';
        TvShowsHead.style.cssText = 'color : red';
        return;
    }
    TvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
    TvShowsHead.style.cssText = 'color : green';

    response.results.forEach(item => {
        console.log(item);
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = poster ? IMG_URL + backdrop : 'img/no-poster.jpg';
        const voteElem = vote ? `<span class='tv-card__vote'>${vote}</span>` : '';

        const card = document.createElement('li');
        card.idTV = id;
        card.className = 'tv-shows__item';
        card.innerHTML = `
        <a href="#" id="${id}" class="tv-card">
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
        dbService.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});
const closeDropdown = () => {
    dropDown.forEach(item => {
        item.classList.remove('active');

    })
};

//окрытие/закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});
document.addEventListener('click', event => {
    const target = event.target;
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
});
leftMenu.addEventListener('click', () => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
    if (target.closest('#top-rated')) {
        console.log('top-rated');
        dbService.getTopRated().then((response) => renderCard(response));
    }
    if (target.closest('#popular')) {
        console.log('popular');
        dbService.getPopular().then((response) => renderCard(response));
    }
    if (target.closest('#week')) {
        console.log('week');
        dbService.getWeek().then((response) => renderCard(response));
    }
    if (target.closest('#today')) {
        console.log('today');
        dbService.getToday().then((response) => renderCard(response));
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
        preLoader.style.display = 'block';
        dbService.getTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage
            }) => {
                if (posterPath) {
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = title;
                    posterWrapper.style.display = '';
                    modalContent.style.paddingLeft = '';
                } else {
                    posterWrapper.style.display = 'none';
                    modalContent.style.paddingLeft = '25px';
                }

                tvCardImg.src = IMG_URL + posterPath;
                tvCardImg.alt = title;
                modalTitle.textContent = title;
                genresList.textContent = '';
                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                });
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .then(() => {
                preLoader.style.display = '';
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