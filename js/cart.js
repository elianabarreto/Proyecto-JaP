document.addEventListener("DOMContentLoaded", async function () {

    const carrito = document.getElementById("tablaCarrito");

    const url = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
    const info_carrito = await getJSONData(url);
    const articulo_carrito = info_carrito.data.articles

    function productoEnCarrito(articulo) {
        return `
        <tr class="text-center">
          <td><img src="${articulo.image}" class="img-thumbnail w-50" alt="${articulo.name}"></td>
          <td>${articulo.name}</td>
          <td>${articulo.currency} <span id="precioUnidad">${articulo.unitCost}</span></td>
          <td><input id="inputCantidad" type="number" value="${articulo.count}" min="1" class="w-50"></td>
          <td>${articulo.currency} <span id="subtotal">${articulo.unitCost}</span></td>
        </tr>
        `
    };
    
    function HTMLCarrito() {
        carrito.innerHTML = productoEnCarrito(articulo_carrito[0]);
    };

    HTMLCarrito();

    let inputCantidad = document.getElementById("inputCantidad");
    let precioUnidad = document.getElementById("precioUnidad");
    let subtotal = document.getElementById("subtotal");

    inputCantidad.addEventListener("input", ()=> {

        subtotal.innerHTML = inputCantidad.value*parseInt(precioUnidad.textContent);

    });

});