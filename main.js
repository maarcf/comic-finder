// DOM Variables // 
const singleResultSection = document.querySelector('.search-result');
const mainSection = document.querySelector('#results');
const totalResults = document.querySelector('#total-results');
const loaderOverlay = document.querySelector('.overlay');
const firstPageButton = document.querySelector('#first-page');
const previousPageButton = document.querySelector('#previous-page');
const nextPageButton = document.querySelector('#next-page');
const lastPageButton = document.querySelector('#last-page');
const searchForm = document.querySelector('#search-form');
const textSearchInput = document.querySelector('#search-input');
const selectType = document.querySelector('#search-type');
const selectSort = document.querySelector('#search-sort');
const labelSort = selectSort.parentElement;

// JS Variables//
const baseUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = '08b7060939db82c5ed50966d57a02ac5';
const imageSize = '/portrait_uncanny';
const noInfo = 'No tenemos información para mostrar 😢';

// Loader //
const showLoader = (overlay, section) => {
  overlay.children[0].setAttribute('aria-hidden', 'false');
  overlay.classList.remove('hidden');
  section.setAttribute('aria-busy', 'true');
};

const hideLoader = (overlay, section) => {
  overlay.children[0].setAttribute('aria-hidden', 'true');
  overlay.classList.add('hidden');
  section.setAttribute('aria-busy', 'false');
};

// Clean HTML //
const cleanSection = section => section.innerHTML = '';

// Disabled and Enabled //
const isDisabled = button => {
  button.disabled = true;
  button.children[0].style.color = '#757575';
};

const isEnabled = button => {
  button.disabled = false;
  button.children[0].style.color = '#fff';
};

// create HTML //
const createCharactersCards = characters => {
  cleanSection(mainSection);
  characters.map(character => {
    mainSection.innerHTML += `
    <article class="character-card" data-character-id="${character.id}">
      <div class="character-img-container">
        <img class="character-img" src="${character.thumbnail.path + imageSize}.${character.thumbnail.extension}" alt="Personaje de Marvel: ${character.name}" />
      </div>
      <h3 class="character-name">${character.name.toUpperCase()}</h3>
    </article>`;
  });
};

const createComicsCards = comics => {
  cleanSection(mainSection);
  comics.map(comic => {
    mainSection.innerHTML += `
    <article class="comic-card" data-comic-id="${comic.id}">
      <div class="comic-img-container">
        <img class="comic-img" src="${comic.thumbnail.path + imageSize}.${comic.thumbnail.extension}" alt="Portada del Comic: ${comic.title}" />
      </div>
      <h3 class="comic-title">${comic.title}</h3>
    </article>`;
  });
};

const createComicSection = (info, noInfo, authors, dateSale) => {
  singleResultSection.innerHTML = `
  <div class="search-img-container">
    <img src="${info.thumbnail.path}.${info.thumbnail.extension}" alt="Portada del Comic: ${info.title}">
  </div>
  <div class="search-info">
    <h2>${info.title}</h2>
    <h3>Publicado:</h3>
    <p>${dateSale}</p>
    <h3>Escritores:</h3>
    <p>${authors.name}</p>
    <h3>Descripción:</h3>
    <p>${info.description.trim() || noInfo}</p>
  </div>`;
};

const createCharacterSection = (info,  noInfo,) => {
  singleResultSection.innerHTML = `
  <div class="search-img-container">
    <img src="${info.thumbnail.path}.${info.thumbnail.extension}" alt="Personaje de Marvel: ${info.name}">
  </div>
  <div class="search-info">
    <h2>${info.name}</h2>
    <h3>Descripción:</h3>
    <p>${info.description.trim() || noInfo}</p>
  </div>`;
};

const createSortSelect = (selectTypeValue, labelSort) => {  
  switch (selectTypeValue) {
    case "comics":
      console.log(labelSort)
      cleanSection(labelSort);
      labelSort.setAttribute('aria-label', '"Ordenar comics por..."');
      labelSort.innerHTML = `
        ORDEN
        <select name="search-sort" id="search-sort">
          <option value="title" selected>A - Z</option>
          <option value="-title">Z - A</option>
          <option value="-foc-date">Más nuevos</option>   
          <option value="foc-date">Más viejos</option>
        </select>
      `;
      break;

    case "characters":
      console.log(labelSort)
      cleanSection(labelSort);
      labelSort.setAttribute('aria-label', '"Ordenar personajes por..."');
      labelSort.innerHTML = `
        ORDEN
        <select name="search-sort" id="search-sort">
          <option value="name" selected>A - Z</option>
          <option value="-name">Z - A</option>
        </select>
      `;
      break;
  }

}

createSortSelect(selectType.value, labelSort);
selectType.onchange = (value, labelSort) => {
  value = selectType.value
  createSortSelect(value, labelSort);
}
// Fetchs //
const comicsFetch = () => {
  fetch(`${baseUrl}/comics?apikey=${apiKey}&offset=0&orderBy=title`)
  .then(res => res.json())
  .then(data => {
    
    console.log(data)
    let comics = data.data.results;
    let total = data.data.total;  
    totalResults.textContent = `${total} RESULTADOS`

    createComicsCards(comics);
    hideLoader(loaderOverlay, mainSection);
    isDisabled(firstPageButton);
    isDisabled(previousPageButton);
  });
};

const charactersFetch = () => {
  fetch(`${baseUrl}/characters?apikey=${apiKey}&offset=0&orderBy=name`)
  .then(res => res.json())
  .then(data => {
    
    console.log(data)

    let characters = data.data.results;
    let total = data.data.total;
    totalResults.textContent = `${total} RESULTADOS`;


    createCharactersCards(characters);  
    hideLoader(loaderOverlay, mainSection);
    isDisabled(firstPageButton);
    isDisabled(previousPageButton);
  });
};

const searchFetch = () => {
  // fetch(`${baseUrl}/comics/71400?apikey=${apiKey}&offset=0`)
  // .then(res => res.json())
  // .then(data => { 
  //   let comic = data.data.results;    
  //   comic.map(info => {
  //     cleanSection(singleResultSection);

  //     let authors = info.creators.items.find(author => author.role === 'writer');
      
  //     let dateSale = info.dates.find(date => date.type === 'onsaleDate');
  //     dateSale = new Date(dateSale.date).toLocaleDateString();

  //     createComicSection(info, noInfo, authors, dateSale);
      
  //   });  

  // });

  fetch(`${baseUrl}/characters/1009157?apikey=${apiKey}&offset=0`)
  .then(res => res.json())
  .then(data => {    
    let character = data.data.results;
    cleanSection(singleResultSection);
    character.map(info => {
      createCharacterSection(info, noInfo);      
    });
  });
};
//showLoader(loaderOverlay, mainSection);

searchFetch();
comicsFetch();
