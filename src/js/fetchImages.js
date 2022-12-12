// import axios from 'axios';

// export { fetchImages };

// axios.defaults.baseURL = 'https://pixabay.com/api/';

// let page = 1;

// async function fetchImages(query) {

//     const optionParam = new URLSearchParams({
//         key: '31858963-601eb0bdde05ce64d7de59e68',
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: 'true',
//         page: page,
//         per_page: 40,
//     });
    
//     const { data } = await axios.get(`?${optionParam}`);
//     page += 1;
//     return data;
// };