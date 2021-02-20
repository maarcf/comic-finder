const baseUrl = 'https://gateway.marvel.com/v1/public/';
const apiKey = '08b7060939db82c5ed50966d57a02ac5';

const mainSection = document.querySelector('#results');
const totalResults = document.querySelector('#total-results');
console.log(totalResults);

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
      <article class="comic-card">
        <div class="comic-img-container">
          <img class="comic-img" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" />
        </div>
        <h3 class="comic-title">${comic.title}</h3>
      </article>`
    })

  })
}

drawComics()