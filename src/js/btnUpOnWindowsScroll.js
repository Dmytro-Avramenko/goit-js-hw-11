export { btnUpOnWindowScroll };
    
const btnUp = document.querySelector('.btn-up');

// Функція що додає кнопку btnUp після зміщення від початкового екрану пошуку
function btnUpOnWindowScroll() {
    const scroll = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scroll > coords) {
        btnUp.style.display = 'block';
    }

    if (scroll < coords) {
        btnUp.style.display = 'none';
    }
}