Hola Male, te dejo algunos comentarios:

1- En botón del modo oscuro si quiero cambiarlo y posiciona el mouse a la altura del ON no funciona, si muevo el mousse para el lado del OFF si lo cambia. No entiendo bien por qué sucede eso. Además si lo cambio desde el teclado (con la barra espaciadora) solo lo cambia a encendido pero no funciona de encendido a apagado. Tendrá que ver que usé add y remove en vez de toggle? o por qué es ?

2- En extras también sumé el select que va a una página especifica, no lo sumé a main por dos razones: primero porque lo hice luego de hacerte entrega oficial del tp y segundo porque enlentence demasiado todo, desde mi pc el navegador me llegó a mostrar hasta tres veces el cartel que dice que la web no responde y pregunta si queres esperar o cerrar.

3- Tengo algunas dudas sobre Programación Funcional. A veces me pasa que no se bien si debo pasar como parámetro o no. Por ejemplo, esta función:

```
const updatePagesInfo = () => {
  let currPage = currentPage + 1;  
  let lastPage = Math.ceil(totalCount / resultsPerPage);
  currentPageHTML.textContent = currPage;
  lastPageHTML.textContent = `${lastPage !== 0 ? lastPage : 1}`;
  previousPageButton.setAttribute('aria-label', `Ir a la página ${currPage - 1}`);
  nextPageButton.setAttribute('aria-label', `Ir a la página ${currPage + 1}`);
};
```
`currentPage`, `totalCount`, `resultsPerPage` y las 4 cosas del DOM que uso deberian pasarse como parámetro de la funcón? 
Tengo algunas funciones de este estilo y es acá cuando me genera dudas. Otro ejemplo es la funcion `displayInfo()` llama a la función `collectionFetch()`, ésta última recibe parámetros, en ese caso el parámetro que es `selectType` se lo deberia agregar (como lo hice) o la función `displayInfo` debería llevar como parámetro ej: `collection` y cuando se ejecuta parasarle el `selectType` cómo parámetro de `displayInfo()`?