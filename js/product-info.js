function redirigeRelacionados(id) {
  localStorage.setItem("productID", id)
  window.location = "product-info.html"
};

document.addEventListener("DOMContentLoaded", async function () {

  //Constantes: contenedores de informacion en el HTML, y ID del producto
  const div_con_info = document.getElementById("infoProduct");
  const div_comments = document.getElementById("divComments");
  const div_relacionados = document.getElementById("divRelacionados");
  const IDProduct = localStorage.getItem("productID");

  //Constantes: informacion del producto
  const urlProduct = `https://japceibal.github.io/emercado-api/products/${IDProduct}.json`;
  const product = await getJSONData(urlProduct);
  const infoProduct = product.data;
  const relatedProducts = infoProduct.relatedProducts;

  //Constantes: array de comentarios, cada uno con su informacion (usuario, fecha, puntaje, etc)
  const urlComments = `https://japceibal.github.io/emercado-api/products_comments/${IDProduct}.json`;
  const comments = await getJSONData(urlComments);
  const arrayComments = comments.data;


  //Funcion para recorrer array de imagenes del producto
  function imagenes(arrayProductos, arrayImagenes) {

    let imagenes = ""
    for (let image of arrayImagenes) {

      imagenes +=
        `<div class="col">
          <img class="img-fluid col-11 rounded-circle shadow" src="${image}" alt="${arrayProductos.name}">
        </div>`;
    };

    return imagenes;

  };

  //Funcion para crear elementos HTML con datos del producto
  function HTMLProduct(producto) {
    return `
    <div class="container">
      <div class="bg-success text-white rounded">
        <h3 class="p-1">${producto.name}</h3>
      </div>
      <hr />
      <div>
        <strong class="text-success">Precio</strong>
        <p>${producto.currency} ${producto.cost}</p>
      </div>
      <div>
        <strong class="text-success">Descripción</strong>
        <p>${producto.description}</p>
      </div>
      <div>
        <strong class="text-success">Categoría</strong>
        <p>${producto.category}</p>
      </div>
      <div>
        <strong class="text-success">Cantidad de vendidos</strong>
        <p>${producto.soldCount}</p>
        <hr class="p-0"/>
      </div>
      <div>
        <strong class="text-success">Imágenes ilustrativas</strong>
        <div class="d-flex mt-3">
          ${imagenes(infoProduct, infoProduct.images)}
        </div>
      </div>
    </div>
    `
  };

  //Funcion que recorre array de comentarios y crea el HTML con los datos de cada uno
  function HTMLComments(array) {

    let comentarios = `
    <div class="bg-success text-white rounded">
      <h5 class="p-1">Comentarios</h5>
    </div>`;

    for (let comment of array) {
      comentarios +=
        `
    <div class="rounded border p-2">
      <p><strong class="text-success">${comment.user}</strong> - ${comment.dateTime} - ${puntaje(comment.score)}</p>
      <p>${comment.description}</p>
    </div>
    `
    };

    if (arrayComments == "") {
      comentarios = "";
    };

    return comentarios;

  };

  //Funcion para representar puntuacion de los comentarios en formato de estrellas
  function puntaje(score) {

    let estrellaVacia = `<span class="fa fa-star"></span>`;
    let estrellaCompleta = `<span class="fa fa-star checked"></span>`;
    let result = 5 - score;
    let totalEstrellas = "";

    if (score > 0) {
      totalEstrellas += (estrellaCompleta).repeat(score);
    };

    if (score < 5) {
      totalEstrellas += (estrellaVacia).repeat(result);
    };

    return totalEstrellas;

  };

  //Funcion que recorre array de productos relacionados y crea el HTML con nombre e imagen de cada uno
  function HTMLProdRelacionados(array) {

    let prodRelacionados = "";

    for (let product of array) {
      prodRelacionados +=`
      <div onclick ="redirigeRelacionados(${product.id})" class="m-2 cursor-active">
          <img class="mt-2 list-group-item-action imf-fluid col-11 rounded-circle shadow" src="${product.image}" alt="${product.name}">
        <p class="mt-2">${product.name}</p>
      </div>`
    };

    return prodRelacionados;

  };

  //Funcion que inserta el HTML con info del producto, e info de los comentarios, de manera dinamica
  function infoYCommentsProduct() {

    if (IDProduct) {
      div_con_info.innerHTML = HTMLProduct(infoProduct);
      div_comments.innerHTML = HTMLComments(arrayComments);
      div_relacionados.innerHTML = HTMLProdRelacionados(relatedProducts);
    };

  };

  infoYCommentsProduct();

});