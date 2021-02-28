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

// JS Variables//
const urlBase ='https://gateway.marvel.com/v1/public/';
const apiKey = '08b7060939db82c5ed50966d57a02ac5';
const imageSize = '/portrait_uncanny';
const noInfo = 'No tenemos información para mostrar 😢';
const resultsPerPage = 20;
let currentPage = 0;
let totalCount = 0;
let offset = 0;

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
    <article class="character-card" data-id="${character.id}">
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
    <article class="comic-card" data-id="${comic.id}">
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
    sort.innerHTML = `
    <option value="title" selected>A - Z</option>
    <option value="-title">Z - A</option>
    <option value="-focDate">Más nuevos</option>   
    <option value="focDate">Más viejos</option>
    `;
  }
  else {
    label.setAttribute('aria-label', 'Ordenar personajes por...');
    sort.innerHTML = `
    <option value="name" selected>A - Z</option>
    <option value="-name">Z - A</option>
    `;
  }
}


// Events //
selectType.onchange = (value, label, sort) => { 
  value = selectType.value;
  label = labelSort;
  sort = selectSort;

  createSortSelect(value, label, sort);   
} 

searchForm.onsubmit = e => {
  e.preventDefault();
  let sort = selectSort.value;
  let collection = selectType.value;

  // COMICS BUSCA POR NOMBRE Y SIN NOMBRE //
  if (collection === 'comics') {
    if (Boolean(textSearchInput.value)) {
      // ESTO ES LO MISMO QUE COMICSFETCH() CAMBIA LA RUTA DE LA API. PENSAR COMO MEJORARLO PARA NO REPETIR CODIGO
      fetch(`${urlBase}${collection}?apikey=${apiKey}&offset=0&orderBy=${sort}&titleStartsWith=${textSearchInput.value}`)
      .then(res => {
        showLoader(loaderOverlay, mainSection);
        return res.json();
      })
      .then(data => {
        
        console.log('Soy data del onsubmit', data)
        let comics = data.data.results;
        totalCount = data.data.total;  
        titleResults.textContent = 'Resultados';
        totalResults.textContent = `${totalCount} RESULTADOS`

        cleanSection(singleResultSection);
        createComicsCards(comics);
        noResults(comics);
        hideLoader(loaderOverlay, mainSection);
        // isDisabled(firstPageButton);
        // isDisabled(previousPageButton);

        const comicsCards = document.querySelectorAll('.comic-card');
        comicsCards.forEach(singleCard => {
          singleCard.onclick = () => {
            let comicId = singleCard.dataset.id;
            singleResultFetch(urlBase, collection, comicId, apiKey);        
          };
        });
      });
    }
    else {
      cleanSection(singleResultSection);
      comicsFetch(urlBase, collection, apiKey, currentPage, resultsPerPage, sort);
    }
  }
  else {
    if (Boolean(textSearchInput.value)) {
      fetch(`${urlBase}${collection}?apikey=${apiKey}&offset=0&orderBy=${sort}&nameStartsWith=${textSearchInput.value}`)
      .then(res => {
        showLoader(loaderOverlay, mainSection);
        return res.json()
      })
      .then(data => {
        
        console.log('Soy data del form', data)

        let characters = data.data.results;
        totalCount = data.data.total;
        titleResults.textContent = 'Resultados';
        totalResults.textContent = `${totalCount} RESULTADOS`;

        cleanSection(singleResultSection);
        createCharactersCards(characters);  
        hideLoader(loaderOverlay, mainSection);
        noResults(characters);

        const charactersCards = document.querySelectorAll('.character-card');
        charactersCards.forEach(singleCard => {
          singleCard.onclick = () => {
          let characterId = singleCard.dataset.id;
          singleResultFetch(urlBase, collection, characterId, apiKey);        
          };
        });
      });
    }
    else {      
      cleanSection(singleResultSection);
      charactersFetch(urlBase, collection, apiKey, sort);
    }

  }
}


// Other Fuctions //
const resetOffset = () => currentPage = 0;
const noResults = result => {
  if (result.length === 0) {
    mainSection.innerHTML = `<h3>No se han encontrado resultados<h3>`;
  };
};


// Pagination //
firstPageButton.onclick = () => {
  console.log('hiciste click en volver al inicio button');
  console.log(currentPage);
  resetOffset();
  // en realidad tendria que ser dependiendo si es personaje o comic el fetch // 
  // REVISAAAAAAAAAR //
  comicsFetch(urlBase, 'comics', apiKey, currentPage, resultsPerPage, 'title');
  console.log(currentPage);
}

previousPageButton.onclick = () => {
  console.log('hiciste click en el boton de página previa');
  console.log(currentPage);
  currentPage--;
  // en realidad tendria que ser dependiendo si es personaje o comic el fetch // 
  // REVISAAAAAAAAAR //
  comicsFetch(urlBase, 'comics', apiKey, currentPage, resultsPerPage, 'title');
  console.log(currentPage);
}

nextPageButton.onclick = () => {
  console.log('hiciste click en el boton de página siguiente');
  console.log(currentPage);
  currentPage++;
  // en realidad tendria que ser dependiendo si es personaje o comic el fetch // 
  // REVISAAAAAAAAAR //
  comicsFetch(urlBase, 'comics', apiKey, currentPage, resultsPerPage, 'title');
  console.log(currentPage);
}

lastPageButton.onclick = () => {
  console.log('hiciste click en el boton de última página');
  let remainder = totalCount % resultsPerPage;
  currentPage = remainder ? (totalCount - remainder) / resultsPerPage : (totalCount / resultsPerPage) - 1;
  // en realidad tendria que ser dependiendo si es personaje o comic el fetch // 
  // REVISAAAAAAAAAR //
  comicsFetch(urlBase, 'comics', apiKey, currentPage, resultsPerPage, 'title');
  console.log(remainder, currentPage);
}

const updatePaginationButtons = () => {
  if (currentPage === 0) {
    isDisabled(firstPageButton);
    isDisabled(previousPageButton);
  }
  else {
    isEnabled(firstPageButton);
    isEnabled(previousPageButton);
  }

  if (offset + 20 > totalCount) {
    isDisabled(nextPageButton);
    isDisabled(lastPageButton);
  }
  else {
    isEnabled(nextPageButton);
    isEnabled(lastPageButton);
  }
}

// Fetchs //
const comicsFetch = (urlBase, collection, apiKey, currentPage, resultsPerPage, sort) => {
  fetch(`${urlBase}${collection}?apikey=${apiKey}&offset=${currentPage * resultsPerPage}&orderBy=${sort}`)
  .then(res => {
    showLoader(loaderOverlay, mainSection);
    return res.json();
  })
  .then(data => {
    
    console.log(data)
    let comics = data.data.results;
    totalCount = data.data.total;  
    titleResults.textContent = 'Resultados';
    totalResults.textContent = `${totalCount} RESULTADOS`

    createComicsCards(comics);
    hideLoader(loaderOverlay, mainSection);
    noResults(comics);

    offset = data.data.offset;
    updatePaginationButtons();

    const comicsCards = document.querySelectorAll('.comic-card');
    comicsCards.forEach(singleCard => {
      singleCard.onclick = () => {
        let comicId = singleCard.dataset.id;
        singleResultFetch(urlBase, collection, comicId, apiKey);        
      }
    })
  });
};

const charactersFetch = (urlBase, collection, apiKey, sort) => {
  fetch(`${urlBase}${collection}?apikey=${apiKey}&offset=0&orderBy=${sort}`)
  .then(res => {
    showLoader(loaderOverlay, mainSection);
    return res.json()
  })
  .then(data => {
    
    console.log(data)

    let characters = data.data.results;
    totalCount = data.data.total;
    totalResults.textContent = `${totalCount} RESULTADOS`;
    titleResults.textContent = 'Resultados';


    createCharactersCards(characters);  
    hideLoader(loaderOverlay, mainSection);
    noResults(characters);

    offset = data.data.offset;
    updatePaginationButtons()

    const charactersCards = document.querySelectorAll('.character-card');
    charactersCards.forEach(singleCard => {
      singleCard.onclick = () => {
        let characterId = singleCard.dataset.id;
        singleResultFetch(urlBase, collection, characterId, apiKey);        
      };
    });
  });
};

const singleResultFetch = (urlBase, collection, id, apiKey) => {
  if (collection === 'comics') {
    fetch(`${urlBase}${collection}/${id}?apikey=${apiKey}&offset=0`)
    .then(res => res.json())
    .then(data => { 
      console.log('Soy el data del singleResult', data)
      let comic = data.data.results;    
      comic.map(info => {
        cleanSection(singleResultSection);

        let authors = info.creators.items
        .filter(author => author.role === 'writer')
        .map(writer => writer.name);
        
        let dateSale = info.dates.find(date => date.type === 'onsaleDate');
        dateSale = new Date(dateSale.date).toLocaleDateString();

        createComicSection(info, noInfo, authors, dateSale);
        singleComicCharactersFetch(urlBase, collection, id, 'characters', apiKey)
        
      });  
    });
  }
  else {
    fetch(`${urlBase}${collection}/${id}?apikey=${apiKey}&offset=0`)
    .then(res => res.json())
    .then(data => {    
      console.log('soy el data en el singleResult', data)
      let character = data.data.results;
      cleanSection(singleResultSection);
      character.map(info => {
        createCharacterSection(info, noInfo);      
      });
      singleCharacterComicsFetch(urlBase, collection, id, 'comics', apiKey)
    });
  };  
};

// fetchComicsDeUnPersonaje
const singleCharacterComicsFetch = (urlBase, idCollection, id, collection, apiKey) => {
  fetch(`${urlBase}${idCollection}/${id}/${collection}?apikey=${apiKey}&offset=0`)
  .then(res => {
    showLoader(loaderOverlay, mainSection);
    return res.json();
  })
  .then(data => {
    
    console.log(data)
    let comics = data.data.results;
    totalCount = data.data.total;  
    titleResults.textContent = 'Comics'
    totalResults.textContent = `${totalCount} RESULTADOS`

    createComicsCards(comics);
    hideLoader(loaderOverlay, mainSection);
    noResults(comics);
    // isDisabled(firstPageButton);
    // isDisabled(previousPageButton);

    const comicsCards = document.querySelectorAll('.comic-card');
    comicsCards.forEach(singleCard => {
      singleCard.onclick = () => {
        let comicId = singleCard.dataset.id;
        singleResultFetch(urlBase, collection, comicId, apiKey);        
      };
    });
  });
};

// fetchCharactersDeUnComic
const singleComicCharactersFetch = (urlBase, idCollection, id, collection, apiKey) => {
  fetch(`${urlBase}${idCollection}/${id}/${collection}?apikey=${apiKey}&offset=0`)
  .then(res => {
    showLoader(loaderOverlay, mainSection);
    return res.json()
  })
  .then(data => {
    
    console.log(data)

    let characters = data.data.results;
    totalCount = data.data.total;
    titleResults.textContent = 'Personajes'
    totalResults.textContent = `${totalCount} RESULTADOS`;


    createCharactersCards(characters);  
    hideLoader(loaderOverlay, mainSection);
    noResults(characters);
    // isDisabled(firstPageButton);
    // isDisabled(previousPageButton);

    const charactersCards = document.querySelectorAll('.character-card');
    charactersCards.forEach(singleCard => {
      singleCard.onclick = () => {
        let characterId = singleCard.dataset.id;
        singleResultFetch(urlBase, collection, characterId, apiKey);        
      };
    });
  });
};




showLoader(loaderOverlay, mainSection);
comicsFetch(urlBase, 'comics', apiKey, currentPage, resultsPerPage, 'title');
