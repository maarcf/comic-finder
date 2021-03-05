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
const titleResults = document.querySelector('#title-results-section');
const darkModeButton = document.querySelector('.dark-mode-button');
const spanInside = darkModeButton.children[0];

// JS Variables //
let url = '';
let queryParam = ''; 
const imageSize = '/portrait_uncanny';
const noInfo = 'No tenemos información para mostrar 😢';
const resultsPerPage = 20;
let currentPage = 0;
let totalCount = 0;
let offset = 0;
const theme = {};
const fetchInfo = {
  url: {},
  query: {}
};


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
  textSearchInput.value = '';
  cleanSection(mainSection);
  characters.map(character => {
    mainSection.innerHTML += `
    <article class="character-card" data-id="${character.id}" tabindex="0">
      <div class="character-img-container">
        <img class="character-img" src="${character.thumbnail.path + imageSize}.${character.thumbnail.extension}" alt="Personaje de Marvel: ${character.name}" />
      </div>
      <h3 class="character-name">${character.name.toUpperCase()}</h3>
    </article>`;
  });
};

const createComicsCards = comics => {
  textSearchInput.value = '';
  cleanSection(mainSection);
  comics.map(comic => {
    mainSection.innerHTML += `
    <article class="comic-card" data-id="${comic.id}" tabindex="0">
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
    <p>${authors.join(', ') || noInfo}</p>
    <h3>Descripción:</h3>
    <p>${info.description || noInfo}</p>
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

const createSortSelect = (value, label, sort) => {
  if (value === 'comics') {
    label.setAttribute('aria-label', 'Ordenar comics por...');
    return (sort.innerHTML = `
    <option value="title" selected>A - Z</option>
    <option value="-title">Z - A</option>
    <option value="-focDate">Más nuevos</option>   
    <option value="focDate">Más viejos</option>
    `);
  }
  else {
    label.setAttribute('aria-label', 'Ordenar personajes por...');
    return(sort.innerHTML = `
    <option value="name" selected>A - Z</option>
    <option value="-name">Z - A</option>
    `);
  }
}


// Events //
selectType.onchange = () => createSortSelect(selectType.value, labelSort, selectSort);

searchForm.onsubmit = e => {
  e.preventDefault();
  cleanSection(singleResultSection);
  resetOffset();
  let type = selectType.value;
  let sort = selectSort.value;
  let inputText = textSearchInput.value;
  sessionStorage.clear();
  saveFetchInfo(type, '', '', sort, inputText);  
  showInfo();
};

darkModeButton.onclick = e => {
  let isChecked = e.target.getAttribute('aria-checked');
  isChecked ? addDarkMode() : removeDarkMode();
};


// Pagination //
firstPageButton.onclick = () => {
  resetOffset();
  offsetNumber(currentPage, resultsPerPage);
  showInfo();
};

previousPageButton.onclick = () => {
  currentPage--;
  offsetNumber(currentPage, resultsPerPage);
  showInfo();
};

nextPageButton.onclick = () => {
  currentPage++;
  offsetNumber(currentPage, resultsPerPage);
  showInfo();
};



lastPageButton.onclick = () => {
  let remainder = totalCount % resultsPerPage;
  currentPage = remainder ? (totalCount - remainder) / resultsPerPage : (totalCount / resultsPerPage) - 1;
  offsetNumber(currentPage, resultsPerPage);
  showInfo();
};

// Other Fuctions //
const showInfo = () => {
  fetchJSON = JSON.parse(sessionStorage.getItem('fetchInfo'));
  console.log('soy fetchJSON', fetchJSON)
  if (!fetchJSON) {
    collectionFetch(selectType);
  }
  else {
    const { collection, id, secondCollection } = fetchJSON.url;
    const { sort, title, name } = fetchJSON.query;
    console.log(collection, id, secondCollection);
    console.log(sort, title, name);

    if (id) {
      collectionFetch(collection, id, secondCollection);
    }
    else if (title || name) {
      selectSort.value = sort;
      textSearchInput.value = title || name;
      collectionFetch(selectType);
    }
    else {
      collectionFetch(selectType);
    };
  };  
};

const saveFetchInfo = (collection, id, secondCollection, sort = false, inputText = false) => {

  fetchInfo.url.collection = collection;
  fetchInfo.url.id = id;
  fetchInfo.url.secondCollection = secondCollection;

  if (sort && inputText) {
    if (collection === 'comics') {
      fetchInfo.query.sort = sort;
      fetchInfo.query.title = inputText;
    }
    else {
      fetchInfo.query.sort = sort;
      fetchInfo.query.name = inputText;
    };
  };  
  sessionStorage.setItem('fetchInfo', JSON.stringify(fetchInfo));
};

const saveDarkMode = boolean => {
  theme.hasDarkMode = boolean;
  localStorage.setItem('theme', JSON.stringify(theme));
}

const addDarkMode = () => {
  document.body.classList.add('dark-mode');
  darkModeButton.setAttribute('aria-checked', true);
  spanInside.style.transform = 'translateX(0)';
  saveDarkMode(true);
}

const removeDarkMode = () => {
  document.body.classList.remove('dark-mode');
  darkModeButton.setAttribute('aria-checked', false);
  spanInside.style.transform = 'translateX(-25px)';
  saveDarkMode(false);
}

const resetOffset = () => {
  currentPage = 0;
  offset = 0;
};

const offsetNumber = (currentPage, resultsPerPage) => offset = currentPage * resultsPerPage;

const noResults = result => {
  if (result.length === 0) {
    mainSection.innerHTML = `<h3>No se han encontrado resultados<h3>`;
  };
};

const updatePaginationButtonsAttribute = () => {
  if (currentPage === 0) {
    isDisabled(firstPageButton);
    isDisabled(previousPageButton);
  }
  else {
    isEnabled(firstPageButton);
    isEnabled(previousPageButton);
  };

  if (offset + resultsPerPage > totalCount) {
    isDisabled(nextPageButton);
    isDisabled(lastPageButton);
  }
  else {
    isEnabled(nextPageButton);
    isEnabled(lastPageButton);
  };
};

// create URL //
const createURL = (collection = 'comics', id = false, secondCollection = false) => {
  const urlBase ='https://gateway.marvel.com/v1/public/';
  const type = collection.value;
  let hasOthersQueriesParam = false;
  url = `${urlBase}${type || collection}`;
  queryParam = createQueryParam(hasOthersQueriesParam);
  
  if (id) {
    url += `/${id}`;

    if (secondCollection) {
      url += `/${secondCollection}`;        
    }
    console.log('LA URL FINAL ES: ', url + queryParam);
    return url + queryParam;
  }
  else {
    console.log('No hay id por eso tiene otros parametros a sumarse')
    hasOthersQueriesParam = true;
    queryParam = createQueryParam(hasOthersQueriesParam);
    console.log('LA URL FINAL ES: ', url + queryParam);
    return url + queryParam;
  };
};

const createQueryParam = boolean => {
  const apiKey = '08b7060939db82c5ed50966d57a02ac5';
  const sort = selectSort.value;
  const type = selectType.value;
  const textSearch = textSearchInput.value;
  const offNum = offset;

  queryParam = `?apikey=${apiKey}&offset=${offNum}`;
  
  if (type === 'comics' && boolean) {
    queryParam += `&orderBy=${sort}`;
  };

  if (type === 'characters' && boolean) {
    queryParam += `&orderBy=${sort}`;
  };

  if (Boolean(textSearch)) {
    type === 'comics' ? queryParam += `&titleStartsWith=${textSearch}` :
    queryParam += `&nameStartsWith=${textSearch}`;
  };

  return queryParam;    
};

// Display Comics and Characters //
const showComics = (data, secondCollection) => {

  let comics = data.data.results;
  totalCount = data.data.total;
  secondCollection ? titleResults.textContent = 'Comics' : titleResults.textContent = 'Resultados';
  totalResults.textContent = `${totalCount} RESULTADOS`;

  createComicsCards(comics);
  hideLoader(loaderOverlay, mainSection);
  noResults(comics);
  updatePaginationButtonsAttribute();

  const comicsCards = document.querySelectorAll('.comic-card');
  comicsCards.forEach(singleCard => {
    singleCard.onclick = () => {
      let comicId = singleCard.dataset.id;
      resetOffset();
      singleResultFetch('comics', comicId);        
    };
  });
};

const showCharacters = (data, secondCollection) => {

  let characters = data.data.results;
  totalCount = data.data.total;
  totalResults.textContent = `${totalCount} RESULTADOS`;
  secondCollection ? titleResults.textContent = 'Personajes' : titleResults.textContent = 'Resultados';

  createCharactersCards(characters);  
  hideLoader(loaderOverlay, mainSection);
  noResults(characters);
  updatePaginationButtonsAttribute();

  const charactersCards = document.querySelectorAll('.character-card');
  charactersCards.forEach(singleCard => {
    singleCard.onclick = () => {
      let characterId = singleCard.dataset.id;
      resetOffset();
      singleResultFetch('characters', characterId);        
    };
  });
};

const showOneComic = (data, id) => {
  let comic = data.data.results;
  comic.map(info => {
  cleanSection(singleResultSection);

  let authors = info.creators.items
  .filter(author => author.role === 'writer')
  .map(writer => writer.name);
        
  let dateSale = info.dates.find(date => date.type === 'onsaleDate');
  dateSale = new Date(dateSale.date).toLocaleDateString();

  createComicSection(info, noInfo, authors, dateSale);
  resetOffset();
  console.log('Estar por hacer collectionFetch desde showOneComic')
  saveFetchInfo('comics', id, 'characters');
  collectionFetch('comics', id, 'characters');
  });
};

const showOneCharacter = (data, id) => {
  let character = data.data.results;
  cleanSection(singleResultSection);
  character.map(info => {
    createCharacterSection(info, noInfo);      
  });
  resetOffset();
  console.log('estas por hacer un fetch a collectionFetch desde showOneCharacter')
  saveFetchInfo('characters', id, 'comics');
  collectionFetch('characters', id, 'comics');
}

// Fetchs //
const collectionFetch = (collection, id, secondCollection) => {  
  let type = collection.value;
  fetch(createURL(collection, id, secondCollection))
  .then(res => {
    showLoader(loaderOverlay, mainSection);
    return res.json();
  })
  .then(data => {
    if (id) {
      secondCollection === 'comics' ? showComics(data, secondCollection) : showCharacters(data,secondCollection);
    }
    else {
      `${type || collection}` === 'comics' ? showComics(data) : showCharacters(data);
    };   
  });
};

const singleResultFetch = (collection, id) => {
  fetch(createURL(collection, id))
  .then(res => {
    showLoader(loaderOverlay, mainSection);
    return res.json();
  })
  .then(data => collection === 'comics' ? showOneComic(data, id) : showOneCharacter(data, id));
};

// Start page //
showLoader(loaderOverlay, mainSection);
collectionFetch(selectType);

// Check Dark Mode //
let themeSaved = JSON.parse(localStorage.getItem('theme'));
if (themeSaved.hasDarkMode) {
  addDarkMode();
}