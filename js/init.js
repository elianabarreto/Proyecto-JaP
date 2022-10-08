const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
};

function borrarUsuario() {
  localStorage.removeItem("Usuario")
};

//Funcion para insertar codigo html con el dato que el usuario ingresa
function usuarioBarraNav(usuario) {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="my-profile.html" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${usuario}
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
              <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
              <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
              <li><a onclick="borrarUsuario()" class="dropdown-item" href="">Cerrar sesión</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>`
};

//Llamamos a la funcion para insertar el dato en la barra de navegacion
document.addEventListener("DOMContentLoaded", () => {

  let li_usuario = document.getElementById("liUsuario");
  let usuario_ingresado = localStorage.getItem("Usuario");

  li_usuario.innerHTML += usuarioBarraNav(usuario_ingresado);

});