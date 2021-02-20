// DOM Variables // 
const mainSection = document.querySelector('#results');
const totalResults = document.querySelector('#total-results');
const loaderOverlay = document.querySelector('.overlay');
const firstPageButton = document.querySelector('#first-page');
const previousPageButton = document.querySelector('#previous-page');
const nextPageButton = document.querySelector('#next-page');
const lastPageButton = document.querySelector('#last-page');

// JS Variables//
const baseUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = '08b7060939db82c5ed50966d57a02ac5';

// Loader //
const showLoader = () => {
  loaderOverlay.children[0].setAttribute('aria-hidden', 'false');
  loaderOverlay.classList.remove('hidden');
  mainSection.setAttribute('aria-busy', 'true')
}
const hideLoader = () => {
  loaderOverlay.children[0].setAttribute('aria-hidden', 'true');
  loaderOverlay.classList.add('hidden');
  mainSection.setAttribute('aria-busy', 'false')
}

// Disabled and Enabled //
const isDisabled = button => {
  button.disabled = true;
  button.children[0].style.color = '#757575';
}

const isEnabled = button => {
  button.disabled = false;
  button.children[0].style.color = '#fff';
}

const drawComics = () => {
  fetch(`${baseUrl}/comics?apikey=${apiKey}&offset=0&orderBy=title`)
  .then(res => res.json())
  .then(data => {
    
    console.log(data)
    let comics = data.data.results;
    let total = data.data.total;

    
    totalResults.textContent = `${total} RESULTADOS`
    mainSection.innerHTML = '';
    comics.map(comic => {
      mainSection.innerHTML += `
      <article class="comic-card" data-comic-id="${comic.id}">
        <div class="comic-img-container">
          <img class="comic-img" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" />
        </div>
        <h3 class="comic-title">${comic.title}</h3>
      </article>`
    })
    hideLoader();
    isDisabled(firstPageButton);
    isDisabled(previousPageButton);
  })
}

showLoader();
drawComics();
