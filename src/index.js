import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/fetchImages';
import { scroll } from './js/scroll';
import { btnUpOnWindowScroll } from './js/btnUpOnWindowsScroll';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const loadEnd = document.querySelector('.load-end');
const btnUp = document.querySelector('.btn-up');

const lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
});

// початковий порожній рядок запиту search, одночасне завантаження 40 карток пошуку lou
let query = '';
const perPage = 40;
let totalPages = 0;

searchForm.addEventListener('submit', formSubmit);

async function formSubmit(evt) {
    // Заборона перезавантаження сторінки
    evt.preventDefault();
    // Стартовий номер сторінки ресетпейдж
    page = 1;
    // Видалення зайвих пробілів чи символів в кінці і на початку ввденого тектового запиту - query 
    query = evt.currentTarget.searchQuery.value.trim();
    // Стирання попередньо завантажених даних галереї перед повторним завантаженням іншого запиту - query
    gallery.innerHTML = '';
    
    // Початковий стан кнопок - схований - is-hidden або відсутній
    loadMore.classList.add('is-hidden');
    loadEnd.classList.add('is-hidden');
    btnUp.style.display = 'none';

    // Відповідь на порожній запит
    if (query === '') {
        return Notiflix.Notify.info ('Enter a word to search for images.');
    } 

    // Константа, яка призупиняє виконання асинхронної функції доки не буде виконано функцію fetchImages
    const { totalHits, hits } = await fetchImages(query);

    // Очистка вікна input після натискання на пошук чи кнопку enter. Місце в радках важливе
    evt.target.reset();

    // У разі відсутнсті збігів по бекенду чи кириличного вводу - викликає функцію alertNoImagesFound
    if (hits.length === 0) {
        alertNoImagesFound();
    } else {
        // У разі збігу пошуку по бекенду - викликає функцію alertYesImagesFound і виводить число знайдених результатів - ${hits} 
        alertYesImagesFound(totalHits);
        totalPages = Math.ceil(totalHits / perPage);
    }

    // Якщо кількість знайдених результаів на бекенді (totalHits) більше за 40 (perPage) знімається клас s-hidden з кнопки завантаження додаткових результатів. Кнопка відоражається
    if (totalHits > perPage) {
        loadMore.classList.remove('is-hidden');
    }

    // Cкрол по сторінці - виклик функції btnUpOnWindowScroll яка відображає кнопку btnUp
    window.addEventListener('scroll', btnUpOnWindowScroll);

    // Звернення до функції, що доповнює сторінку додатково завантаженими зображеннями
    renderCards(hits);

    // Очистка виклику бібліотеки lightbox
    lightbox.refresh();
}

function alertNoImagesFound() {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function alertYesImagesFound(hits) {
    Notiflix.Notify.success(`Hooray! We found ${hits} images.`
    );
}

// Створення розмітки картки з стилями і властивостями завантаженого зображення
function createCards(cards) {
  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
            <a class="gallery__link" href="${largeImageURL}">
                <div class="gallery-item">
                    <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes </b>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views </b>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments </b>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads </b>${downloads}
                        </p>
                    </div>
                </div>
            </a>
        `
    )
    .join('');
}

// Рендер перших - 40 ${hits} images карток зображень 
function renderCards(cards) {
    gallery.insertAdjacentHTML('beforeend', createCards(cards));
}

// Отримання наступних 40 ${hits} images карток зображень після натискання на кнопку loadMore  
loadMore.addEventListener('click', сlickLoadMoreBtn); 

// Асинхронна фунція що звертається до функції fetchImages перевіряє номер завантаженої сторінки, змінює стан кнопки loadMore
async function сlickLoadMoreBtn() {
    totalPages -= 1;
    const { hits } = await fetchImages(query);
    renderCards(hits);
    scroll();

    if (totalPages === 1) {
        loadMore.classList.add('is-hidden');
        alertLoadEnd();
    }
    // Очистка виклику бібліотеки lightbox
    lightbox.refresh();    
}

// У випадку закінчення досупного для завантаження ${hits} images карток забирає клас is-hidden з контейнеру з відповідним текстом у розмітці
function alertLoadEnd() {
    loadEnd.classList.remove('is-hidden');
}

btnUp.addEventListener('click', сlickToUpBtn);

// Функція яка при кліку на кнопку Up повертає користувача на верх сторінки та ховає кнопку Up
function сlickToUpBtn() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btnUp.style.display = 'none';
};