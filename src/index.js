import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '7174354-ef918e90966d1ea03da9f21a5';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.btn-load-more');

const perPage = 40;
let query = '';
let page = 1;
let simpleLightBox;

// Список параметрів рядка запиту
async function fetchImages(query, page, perPage) {
  const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}

// Властивості масиву зображень
function renderGallery(images) {
  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        id,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

// HTTP-запити
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  btnLoadMore.classList.add('is-hidden');

  if (query === '') {
    console.log('порожньо');
    return;
  }
  console.log(query);
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      console.log(data);

      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        console.log(data.hits);

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();

        if (data.totalHits > perPage) {
          btnLoadMore.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
});

// кнопки запит за наступнe групe зображень
btnLoadMore.addEventListener('click', e => {
  page += 1;
  simpleLightBox.destroy();
    
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a')
        .refresh();
        scroll();      

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        btnLoadMore.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
});

// плавний скрол
function scroll() { 
  const { height: cardHeight } = gallery.
    firstElementChild.
    getBoundingClientRect();
  
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

