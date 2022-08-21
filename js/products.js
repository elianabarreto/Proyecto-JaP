const urlAutos = "https://japceibal.github.io/emercado-api/cats_products/101.json";

//Función para crear div con toda la info de cada producto de la categoría "Autos", dentro del html
function infoProductHTML(producto){
  return `
<div class="list-group">
  <div class="list-group-item list-group-item-action cursor-active">
    <div class="row">
        <div class="col-3">
          <img class="img-thumbnail" src="${producto.image}" alt="${producto.description}">
        </div>
        <div class="col">
        <div class="d-flex w-100 justify-content-between">
          <h3 class="mb-1">${producto.name} - ${producto.currency} ${producto.cost}</h3>
          <small class="text-muted">${producto.soldCount} Vendidos</small>
        </div>
          <p class="mb-1">${producto.description}</p>
        </div>
        </div>
    </div>
  </div>
</div>
  `;
};

//Al cargar el documento, se itera en cada auto del arreglo, y se agrega su info al html
document.addEventListener("DOMContentLoaded", async function() {

  const listado = document.getElementById("listadoAutos");

  const autos = await getJSONData(urlAutos);

  for (let auto of autos.data.products) {
    listado.innerHTML += infoProductHTML(auto);
  };
});