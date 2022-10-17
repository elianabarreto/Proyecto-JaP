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

  //Funcion que recorre array de imagenes del producto y las inserta en carousel de Bootstrap
  function imagenes(producto, arrayImagenes) {

    let imagenes = `<div class="carousel-item active">
                      <img src="img/prod${IDProduct}_1.jpg" class="d-block w-100" alt="${producto.name}">
                    </div>`

    for (let i = 1; i < arrayImagenes.length; i++) {
      
      imagenes +=
         `<div class="carousel-item">
            <img src="${arrayImagenes[i]}" class="d-block w-100" alt="${producto.name}">
          </div>`;
      
    }

    return imagenes;

  };

  //Funcion para crear elementos HTML con datos del producto
  function HTMLProduct(producto, arrayImagenes) {
    return `
    <div class="container row">
      <div class="col-5">
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
          <button id="btnComprar" class="w-100 btn btn-primary">Comprar</button>
        </div>
      </div>
      <div class="col-5 w-50 m-auto">
        <div id="carouselExampleIndicators" class="carousel slide align" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 3"></button>
          </div>
          <div class="carousel-inner">
          ${imagenes(producto, arrayImagenes)}
          </div>
          <button class="carousel-control-prev bg-success" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next bg-success" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
    `
  };

  
/*   let productosComprados = []
  //Evento para agregar producto al carrito
  document.getElementById("btnComprar").addEventListener("click", () =>{

    



  }); */

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
      prodRelacionados += `
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
      div_con_info.innerHTML = HTMLProduct(infoProduct, infoProduct.images);
      div_comments.innerHTML = HTMLComments(arrayComments);
      div_relacionados.innerHTML = HTMLProdRelacionados(relatedProducts);
    };

  };

  infoYCommentsProduct();

});