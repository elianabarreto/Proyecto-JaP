document.addEventListener("DOMContentLoaded", async function () {

    const carrito_tbody = document.getElementById("carrito");

    //Solicitud al servidor, para traer articulo precargado al carrito
    const url = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
    const info_carrito = await getJSONData(url);
    const articulo_carrito = info_carrito.data.articles;

    //Traemos lo que tenemos en localStorage
    const infoStorage = JSON.parse(localStorage.getItem("Carrito"));

    function convertirMoneda(currency, cost) {

        if (currency === "UYU") {
            let total = cost / 42;
            return Math.round(total);
        } else {
            return cost
        };
    };

    //Funcion para crear contenido HTML que se inserta dentro del tbody del carrito
    function HTMLCarrito(articuloServidor, articulosStorage) {

        let carro = `
        <tr>
          <td class="col-md-2 p-1"><img src="${articuloServidor.image}" class="img-fluid rounded-pill" alt="${articuloServidor.name}"></td>
          <td class="col-md-2 p-1">${articuloServidor.name}</td>
          <td class="col-md-2 p-1">${articuloServidor.currency} <span id="precioUnidad${articuloServidor.id}">${convertirMoneda(articuloServidor.currency, articuloServidor.unitCost)}</span></td>
          <td class="col-md-2 p-1"><input class="form-control" id="inputCantidad${articuloServidor.id}" type="number" value="${articuloServidor.count}" min="1" class="w-50"></td>
          <td class="col-md-2 p-1">${articuloServidor.currency} <span id="subtotal${articuloServidor.id}">${convertirMoneda(articuloServidor.currency, articuloServidor.unitCost)}</span></td>
        </tr>
        `;

        for (let articulo of Object.values(articulosStorage)) {
            carro += `
            <tr>
              <td class="col-md-2 p-1"><img src="${articulo.image}" class="img-fluid rounded-pill" alt="${articulo.name}"></td>
              <td class="col-md-2 p-1">${articulo.name}</td>
              <td class="col-md-2 p-1">USD <span id="precioUnidad${articulo.id}">${convertirMoneda(articulo.currency, articulo.unitCost)}</span></td>
              <td class="col-md-2 p-1"><input class="form-control" id="inputCantidad${articulo.id}" type="number" value="${articulo.count}" min="1" class="w-50"></td>
              <td class="col-md-2 p-1">USD <span id="subtotal${articulo.id}">${convertirMoneda(articulo.currency, articulo.unitCost)}</span></td>
            </tr>
            `
        };

        return carro;
    };

    //Funcion para sumar los valores de los subtotales de los productos en carrito, del servidor y del localStorage
    function sumaSubtotalesProductos(articuloServidor, articulosStorage) {

        let subtotal = document.getElementById(`subtotal${articuloServidor.id}`);
        let suma = parseInt(subtotal.textContent);

        for (let articulo of Object.values(articulosStorage)) {

            let subtotal2 = document.getElementById(`subtotal${articulo.id}`);
            suma += parseInt(subtotal2.textContent)
        };

        return suma;
    };

    let subtotalGeneral = document.getElementById("subtotal");
    let total = document.getElementById("total");
    let costoEnvio = document.getElementById("costoEnvio");
    let btnPremium = document.getElementById("premium");
    let btnExpress = document.getElementById("express");
    let btnStandard = document.getElementById("standard");

    //Funcion para calcular el costo de envio, segun input seleccionado
    function costoDeEnvio() {

        if (btnPremium.checked) {
            costoEnvio.innerHTML = Math.round(parseInt(subtotalGeneral.textContent) * 0.15);
            total.innerHTML = parseInt(subtotalGeneral.textContent) + parseInt(costoEnvio.textContent);
        };

        if (btnExpress.checked) {
            costoEnvio.innerHTML = Math.round(parseInt(subtotalGeneral.textContent) * 0.07);
            total.innerHTML = parseInt(subtotalGeneral.textContent) + parseInt(costoEnvio.textContent);
        };

        if (btnStandard.checked) {
            costoEnvio.innerHTML = Math.round(parseInt(subtotalGeneral.textContent) * 0.05);
            total.innerHTML = parseInt(subtotalGeneral.textContent) + parseInt(costoEnvio.textContent);
        };
    };

    // Eventos a inputs radio de costo envio
    btnPremium.addEventListener("input", () => {
        costoDeEnvio();
    });

    btnExpress.addEventListener("input", () => {
        costoDeEnvio();
    });

    btnStandard.addEventListener("input", () => {
        costoDeEnvio();
    });

    //CAMBIAR NOMBRE DE FUNCION
    //Funcion para calcular subtotales, trae los inputs segun su id, segun provengan del servidor o del localStorage
    function subtotalProductoYsubtotalGeneral(articuloServidor, articulosStorage) {

        let precioUnidad = document.getElementById(`precioUnidad${articuloServidor.id}`);
        let inputCantidad = document.getElementById(`inputCantidad${articuloServidor.id}`);
        let subtotal = document.getElementById(`subtotal${articuloServidor.id}`);

        subtotalGeneral.innerHTML = sumaSubtotalesProductos(articuloServidor, articulosStorage)

        inputCantidad.addEventListener("input", () => {

            subtotal.innerHTML = inputCantidad.value * parseInt(precioUnidad.textContent);
            subtotalGeneral.innerHTML = sumaSubtotalesProductos(articuloServidor, articulosStorage);
            costoDeEnvio();

        });

        for (let articulo of Object.values(articulosStorage)) {

            let precioUnidad2 = document.getElementById(`precioUnidad${articulo.id}`);
            let inputCantidad2 = document.getElementById(`inputCantidad${articulo.id}`);
            let subtotal2 = document.getElementById(`subtotal${articulo.id}`);

            inputCantidad2.addEventListener("input", () => {

                subtotal2.innerHTML = inputCantidad2.value * parseInt(precioUnidad2.textContent);
                subtotalGeneral.innerHTML = sumaSubtotalesProductos(articuloServidor, articulosStorage);
                costoDeEnvio();

            });

        };

    };

    let tarjetaCredito = document.getElementById("tarjetaCredito");
    let inputNumTarjeta = document.getElementById("inputNumTarjeta");
    let inputCodeTarjeta = document.getElementById("inputCodeTarjeta");
    let inputVencimiento = document.getElementById("inputVencimiento");

    let transferencia = document.getElementById("transferencia");
    let inputNumCuenta = document.getElementById("inputNumCuenta");

    function desactivarCamposModal() {

        tarjetaCredito.addEventListener("click", () => {

            if (tarjetaCredito.checked) {
                inputNumTarjeta.disabled = false
                inputCodeTarjeta.disabled = false
                inputVencimiento.disabled = false

                inputNumCuenta.disabled = true
            };

        });

        transferencia.addEventListener("click", () => {

            if (transferencia.checked) {
                inputNumTarjeta.disabled = true
                inputCodeTarjeta.disabled = true
                inputVencimiento.disabled = true

                inputNumCuenta.disabled = false
            };

        });

    };

    desactivarCamposModal();

    //Procedimiento que imprime toda la informacion necesaria en pantalla
    function productosCarrito() {
        carrito_tbody.innerHTML = HTMLCarrito(articulo_carrito[0], infoStorage);
        subtotalProductoYsubtotalGeneral(articulo_carrito[0], infoStorage)
    };

    productosCarrito();

    ;

    //Validaciones del formulario
    const formulario = document.getElementById("formulario");
    const calle = document.getElementById("calle");
    const numCalle = document.getElementById("numCalle");
    const esquina = document.getElementById("esquina");
    const inputsCantidad = carrito_tbody.getElementsByTagName("input");

    let validar = true

    formulario.addEventListener("submit", (evento) => {

        if (calle.value == "") {
            calle.classList.add("is-invalid");

            evento.preventDefault();
            evento.stopPropagation();
            validar = false
        };

        if (numCalle.value == "") {
            numCalle.classList.add("is-invalid");

            evento.preventDefault();
            evento.stopPropagation();
            validar = false
        };

        if (esquina.value == "") {
            esquina.classList.add("is-invalid");

            evento.preventDefault();
            evento.stopPropagation();
            validar = false
        };

        if ((btnPremium.checked || btnExpress.checked || btnStandard.checked) == false) {
            evento.preventDefault();
            evento.stopPropagation();

            btnPremium.classList.add("is-invalid");
            btnExpress.classList.add("is-invalid");
            btnStandard.classList.add("is-invalid");
            validar = false
        };

        for (let input of inputsCantidad) {
            if (input.value <= 0) {
                input.classList.add("is-invalid");

                evento.preventDefault();
                evento.stopPropagation();
                validar = false
            } else {
                input.classList.remove("is-invalid");
            };
        };

        if (tarjetaCredito.checked == false && transferencia.checked == false) {
            evento.preventDefault();
            evento.stopPropagation();

            inputNumTarjeta.classList.add("is-invalid");
            inputCodeTarjeta.classList.add("is-invalid");
            inputVencimiento.classList.add("is-invalid");
            inputNumCuenta.classList.add("is-invalid");

            document.getElementById("linkModal").classList.add("is-invalid");
            validar = false
        };

        if (tarjetaCredito.checked) {
            if (inputNumTarjeta.value == "") {
                evento.preventDefault();
                evento.stopPropagation();

                inputNumTarjeta.classList.add("is-invalid");
                validar = false
            };

            if (inputCodeTarjeta.value == "") {
                evento.preventDefault();
                evento.stopPropagation();

                inputCodeTarjeta.classList.add("is-invalid");
                validar = false
            };

            if (inputVencimiento.value == "") {
                evento.preventDefault();
                evento.stopPropagation();

                inputVencimiento.classList.add("is-invalid");
                validar = false
            };
        };

        if (transferencia.checked && inputNumCuenta.value == "") {
            evento.preventDefault();
            evento.stopPropagation();

            inputNumCuenta.classList.add("is-invalid");
            validar = false
        };

        if (validar) {
            document.getElementById("alert").classList.remove("d-none");
            evento.preventDefault();
            evento.stopPropagation();
        };

    });

});