Querida Marian, 

Pero qué buen trabajo me entregaste. Estoy muy contenta viendolo: todo funciona fantastico, todo se ve bien. En todo esta lleno de detalles que muestran el cuidado y el tiempo invertido en este TP. Como me tenes acostumbrada, tu codigo no solo es claro y prolijo sino que se nota el esfuerzo por hacerlo legible y el increible dominio que tenes de JS para haberlo usado por tan poquito tiempo. 
Espero que estes tan orgullosa como yo. 

Como me tenes acostumbrada, incorporas las funcionalidades avanzadas con una fluidez que haria creer que llevas mucho mas tiempo codeando. Los cambios desde el modelo sugerido a la web final solo son mejoras: no hay nada en donde se nota que te hayas rendido. Mejoraste la web modelo, y lo hiciste pensando desde la perspectiva del usuario. Excelente. Que la web haga un scroll hacia arriba en el cambio de paginacion -brillante!, lo cuidado de cada cosa en el modo oscuro, el agregado de en qué pagina estoy, el boton de volver atras y la excelente manera en que lo resolviste desde el lado del codigo... es maravilloso ver tanto interes y esmero en entregar un producto finalizado. No un TP, es imposible hacer una web asi si una esta pensando simplemente en aprobar un trabajo. Esto es un producto completo, y me habla de tu capacidad como desarrolladora front end, de tu futuro como desarrolladora front end: una persona que esta comprometida a entregar el mejor trabajo posible, que esta motivada no por la tarea a realizar sino por la web que va a construir, y otros disfrutar. 

Pasemos a tu codigo. 

Tu HTML es correcto, el uso de etiquetas semanticas preciso y adecuado, la accesibilidad siempre presente. Quiza pecas de excesiva en algunos comentarios, algo que ya habiamos notado en tus TPs: no necesito un comentario para saber que algo es un favicon, aunque entiendo la decision y prefiero en esta etapa que los comentarios sobren y no que falten. 
Impecable el sass, muy prolijo el codigo, la identacion, perfecto uso de variables. Cambiaria de lugar algunas cosas, la clase hidden deberia ir en base, y quiza "footer" sea mas bien un componente que parte del layout, pero son detalles. 

Tu proyecto en Github esta prolijo, tus commits tienen excelentes nombres y se nota que fuiste ordenadamente. Solo lamento que no haya branches: son realmente muy utiles para ordenar el trabajo, y mientras mas las practiques ahora, mas te agradecerá la Marian del futuro sufriendo en su primer trabajo como dev. Tu README es muy, muy bueno, amable, atractivo y contando todo lo que se necesita del proyecto. Quiza le agregaria la necesidad de usar LiveServer para correr el proyecto local. 

Con respecto a tus preguntas:

1. Boton modo oscuro: Es un doble problema. En primer lugar, estas asumiendo que aria-checked te va a retornar booleanos `true` y `false`, cuando te esta retornando los *strings* "true" y "false": https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
Por lo tanto tu ternario siempre da `true` porque tanto "true" como "false" (en string) se convierten a `true` en la coerción. 
El segundo problema es que estrictamente al hacer click en el circulito negro, si bien el boton se cliquea, y se dispara el evento, el `target` de ese evento no es el boton en sí sino el `span` que tenes dentro. Ese span no puede ser un aria-checked, nos da null al intentarlo. Asi que tenemos que asegurarnos de que revisemos el checked del boton, y no del spam. Un codigo que soluciona ambas cosas es este:

```js
darkModeButton.onclick = e => {
  let isChecked = e.target.closest("button").getAttribute('aria-checked');
  isChecked === "true" ?  removeDarkMode() : addDarkMode()
};
```

2. Select que cuelga la web: Ufff, era un problema imposible de descubrir por tu cuenta. Tiene que ver con como el motor de javascript maneja el DOM. 
Ya hablamos de que actualizar el DOM es una operación que insume muchos recursos: aca acabas de descubrir cuantos realmente. Tu for tiene mas o menos 2000 vueltas en el primer render, eso significa crear 2000 opciones y agregarlas al DOM. Dos operaciones pesadas, las dos a la vez!
Cuando lanzamos, sin mas, un for con una actualizacion del DOM, todo ocurre mas o menos a la vez: el for va mas rapido que el DOM, va acumulando cosas a mostrar en el DOM, el navegador no puede con todo... y se cuelga la pagina. 
Si agregamos esta operacion a una funcion, javascript puede separar por un lado el for y por otro la actualizacion del DOM y asi completar la operacion en menos tiempo, sin colgarse. 
Esto es un tema avanzadiiiisimo asi que no espero que lo domines. Pero fijate la diferencia si reemplazamos tu codigo con esto:

```js
const makeSelectOptions = (allPages) => {
  let option = "";
  for (let i = 1; i <= allPages; i++) {
    option += `<option value="${i}">${i}</option>`;
  }
  return option;
};

const selectPage = () => { 
  choosePage.innerHTML = '';
  let lastPage = totalCount / resultsPerPage
  choosePage.innerHTML = makeSelectOptions(lastPage)
};
```

3. Programacion funcional: Si, en programacion funcional idealmente vas a pasar como parametro todo. 
La funcion que me das como ejemplo *no* recibe ningun parametro, sino que se fija en los valores de variables globales. Una de las reglas de programacion funcional es: a los mismos parametros, debemos retornar los mismos valores. En el caso de una funcion que no recibe parametros, sino que se fija valores externos, no tenemos garantia de que eso ocurra. 
Si hay que hacer "trencito" de parametros, como ocurre cuando una funcion llamada dentro de otra necesta algun dato, no hay problema en hacerlo. 
De todos modos la programacion funcional y JS vanilla no son las mejores amigas, se complica mucho con algunos valores. No te estreses por dejar todas tus funciones al 100%, pero con tenerlo en cuenta ya sumas un monton. 


Felicitaciones nuevamente, y segui asi! 


  ✅ Respeta la consigna
  ✅ Respeta el diseño dado
  ✅ Respeta el funcionamiento
  ✅ Responsive funciona correctamente

  ✅ HTML semántico
  ✅ Código bien indentado
  ✅ Buenos nombres de clases
  ✅ Buenos nombres de funciones y variables
  ✅ Uso de variables (SASS)

  ✅ Buena estructura y separación de archivos (SASS)
  ✅ Correcto uso de estilos anidados (SASS)
  ✅ Nombres de branchs adecuados

  ✅ Componentización de estilos (SASS)
  ✅ Funciones pequeñas
  ✅ Lógica clara y simple
  ✅ Separación clara de manejo de datos y visualización

  ✅ Reutilización de lógica / funciones
  ✅ Commits con mensajes adecuados

Nota final: **10**
