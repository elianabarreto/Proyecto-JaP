//Funcion que setea la ID de cada producto, y redirige a "product-info.html" para ver mas informacion
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
};

document.addEventListener("DOMContentLoaded", async function () {

  //Obtenemos del localStorage la ID correspondiente a cada categoria de productos para iterar luego
  let catID = localStorage.getItem("catID");
  let url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
  let listado = document.getElementById("listado");
  let productos = await getJSONData(url);
  let arrayProductos = productos.data.products
  let descripcionCat = document.getElementById("descripcionCat");
  let catName = productos.data.catName;

  //Variables utilizadas para ordenar y filtrar
  const ordenPrecioAsc = "0-9";
  const ordenPrecioDesc = "9-0";
  const ordenVentasDesc = "Vendidos";

  let btnFiltrar = document.getElementById("rangeFilterCount");
  let btnPrecioDesc = document.getElementById("sortDesc");
  let btnPrecioAsc = document.getElementById("sortAsc");
  let btnRelevanciaDesc = document.getElementById("sortByCount");
  let btnLimpiar = document.getElementById("clearRangeFilter");

  let array = [];
  let inputPrecioMin = document.getElementById("rangeFilterCountMin");
  let inputPrecioMax = document.getElementById("rangeFilterCountMax");
  let criterioActual = undefined;
  let min = undefined;
  let max = undefined;

  //Función para crear div con toda la info de cada producto dentro de su categoria correspondiente
  function infoProductHTML(producto) {
    return `
    <div onclick = "setProductID(${producto.id})" class="list-group">
      <div class="list-group-item list-group-item-action cursor-active">
        <div class="row">
            <div class="col-3">
              <img class="img-thumbnail rounded" src="${producto.image}" alt="${producto.description}">
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

  function insertaHTML() {

    //Iteramos en cada producto de una categoria y lo mostramos
    for (let producto of arrayProductos) {
      listado.innerHTML += infoProductHTML(producto);
    };

    //Mostramos la descripcion de cada categoria
    descripcionCat.innerHTML = `Verás aquí todos los productos de la categoría ${catName}`;

  };

  insertaHTML();

  //Funcion para ordenar productos segun criterio
  function ordenarProductos(criterio, array) {

    let resultado = [];

    //Criterio de orden
    if (criterio === ordenPrecioAsc) {
      resultado = array.sort(function (a, b) {
        return a.cost - b.cost;
      });
    } else if (criterio === ordenPrecioDesc) {
      resultado = array.sort(function (a, b) {
        return b.cost - a.cost;
      });
    } else if (criterio === ordenVentasDesc) {
      resultado = array.sort(function (a, b) {
        let aCantidad = parseInt(a.soldCount);
        let bCantidad = parseInt(b.soldCount);
        return bCantidad - aCantidad;
      });
    };
    return resultado;
  };

  //Funcion para mostrar productos filtrados
  function mostrarListaProductos() {

    let agregarContenidoHtml = "";
    for (let i = 0; i < array.length; i++) {
      let producto = array[i];

      if (((min == undefined) || (min != undefined && parseInt(producto.cost) >= min)) &&
        ((max == undefined) || (max != undefined && parseInt(producto.cost) <= max))) {

        agregarContenidoHtml += infoProductHTML(producto);
      };
      listado.innerHTML = agregarContenidoHtml;
    };
  };

  //Funcion para ordenar y mostrar productos filtrados
  function ordenarYMostrarListaProductos(criterioOrden, categoriasArray) {
    criterioActual = criterioOrden;

    if (categoriasArray != undefined) {
      array = categoriasArray;
    };

    array = ordenarProductos(criterioActual, array);

    mostrarListaProductos();
  };

  //Eventos
  btnPrecioAsc.addEventListener('click', () => {
    ordenarYMostrarListaProductos(ordenPrecioAsc, arrayProductos)
  });

  btnPrecioDesc.addEventListener('click', () => {
    ordenarYMostrarListaProductos(ordenPrecioDesc, arrayProductos)
  });

  btnRelevanciaDesc.addEventListener('click', () => {
    ordenarYMostrarListaProductos(ordenVentasDesc, arrayProductos)
  });

  btnFiltrar.addEventListener("click", () => {
    min = inputPrecioMin.value;
    max = inputPrecioMax.value;

    if ((min != undefined) && (min != "") && (parseInt(min)) >= 0) {
      min = parseInt(min);
    }
    else {
      min = undefined;
    }

    if ((max != undefined) && (max != "") && (parseInt(max)) >= 0) {
      max = parseInt(max);
    }
    else {
      max = undefined;
    }

    ordenarYMostrarListaProductos(ordenPrecioAsc, arrayProductos)
  });

  btnLimpiar.addEventListener("click", () => {
    inputPrecioMin.value = "";
    inputPrecioMax.value = "";

    min = undefined;
    max = undefined;
    mostrarListaProductos();
  });

});