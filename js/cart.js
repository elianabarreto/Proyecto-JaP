const carrito_tbody = document.getElementById("carrito_tbody");

//Funcion que evalua, si la moneda del producto es "UYU", hace la conversion a dolares
function convertirMoneda(currency, cost, cantidad) {
    if (currency === "UYU") {
        let montoUSD = cost / 42;
        let total = montoUSD * cantidad
        return Math.round(total);
    } else {
        return cost * cantidad
    };
};

//Funcion para crear contenido HTML que se inserta dentro del tbody del carrito
function HTMLCarrito(articuloServidor, articulosStorage) {

    let carro = `
    <tr id="tr${articuloServidor.id}">
      <td class="col-md-2 p-1"><img src="${articuloServidor.image}" class="img-fluid rounded-pill" alt="${articuloServidor.name}"></td>
      <td class="col-md-2 p-1">${articuloServidor.name}</td>
      <td class="col-md-2 p-1">${articuloServidor.currency} <span id="precioUnidad${articuloServidor.id}">${convertirMoneda(articuloServidor.currency, articuloServidor.unitCost, 1)}</span></td>
      <td class="col-md-2 p-1"><input class="form-control" id="inputCantidad${articuloServidor.id}" type="number" value="${articuloServidor.count}" min="1" class="w-50"></td>
      <td class="col-md-2 p-1">${articuloServidor.currency} <span id="subtotal${articuloServidor.id}">${convertirMoneda(articuloServidor.currency, articuloServidor.unitCost, articuloServidor.count)}</span></td>
      <td class="col-md-1"><button id="btn${articuloServidor.id}" class="btn btn-danger" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
    </svg></button></td>
    </tr>
    `;

    for (let articulo of Object.values(articulosStorage)) {
        carro += `
        <tr id="tr${articulo.id}">
          <td class="col-md-2 p-1"><img src="${articulo.image}" class="img-fluid rounded-pill" alt="${articulo.name}"></td>
          <td class="col-md-2 p-1">${articulo.name}</td>
          <td class="col-md-2 p-1">USD <span id="precioUnidad${articulo.id}">${convertirMoneda(articulo.currency, articulo.unitCost, 1)}</span></td>
          <td class="col-md-2 p-1"><input class="form-control" id="inputCantidad${articulo.id}" type="number" value="${articulo.count}" min="1" class="w-50"></td>
          <td class="col-md-2 p-1">USD <span id="subtotal${articulo.id}">${convertirMoneda(articulo.currency, articulo.unitCost, articulo.count)}</span></td>
          <td class="col-md-1"><button id="btn${articulo.id}" class="btn btn-danger" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg></button></td>
        </tr>
        `
    };

    return carro;
};

//Funcion para eliminar producto del carrito
function eliminarProducto(articuloServidor, articulosStorage) {

    let btnEliminar1 = document.getElementById(`btn${articuloServidor.id}`);

    //Evento al boton del PRODUCTO QUE VIENE DEL SERVIDOR
    btnEliminar1.addEventListener("click", () => {
        document.getElementById(`tr${articuloServidor.id}`).remove();
    });

    //Iteramos los productos del localStorage
    for (let articulo of Object.values(articulosStorage)) {

        let btnEliminar2 = document.getElementById(`btn${articulo.id}`);

        //y le damos un evento al boton de cada producto
        btnEliminar2.addEventListener("click", () => {
            let carrito = JSON.parse(localStorage.getItem("Carrito"));
            delete carrito[articulo.id];
            localStorage.setItem("Carrito", JSON.stringify(carrito));
            document.getElementById(`tr${articulo.id}`).remove();
        });
    };
};

//Funcion para sumar los valores de los subtotales de los productos en carrito, del servidor y del localStorage
function sumaSubtotalesProductos(articuloServidor, articulosStorage) {

    let subtotalServidor = document.getElementById(`subtotal${articuloServidor.id}`);
    let suma = parseInt(subtotalServidor.textContent);

    for (let articulo of Object.values(articulosStorage)) {
        let subtotalStorage = document.getElementById(`subtotal${articulo.id}`);
        suma += parseInt(subtotalStorage.textContent)
    };

    return suma;
};

document.addEventListener("DOMContentLoaded", async function () {

    //Solicitud al servidor, para traer articulo precargado al carrito
    const url = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
    const info_carrito = await getJSONData(url);
    const articulo_carrito = info_carrito.data.articles;

    const subtotalGeneral = document.getElementById("subtotalGeneral");
    const total = document.getElementById("total");
    const costoEnvio = document.getElementById("costoEnvio");
    const btnPremium = document.getElementById("premium");
    const btnExpress = document.getElementById("express");
    const btnStandard = document.getElementById("standard");

    //Inputs del modal
    const tarjetaCredito = document.getElementById("tarjetaCredito");
    const inputNumTarjeta = document.getElementById("inputNumTarjeta");
    const inputCodeTarjeta = document.getElementById("inputCodeTarjeta");
    const inputVencimiento = document.getElementById("inputVencimiento");

    //Inputs radio del modal
    const transferencia = document.getElementById("transferencia");
    const inputNumCuenta = document.getElementById("inputNumCuenta");

    //Funcion para calcular segun input seleccionado, el porcentaje correspondiente
    function porcentajeCostoEnvio(inputRadio, porcentaje) {
        if (inputRadio.checked) {
            costoEnvio.innerHTML = Math.round(parseInt(subtotalGeneral.textContent) * porcentaje);
            total.innerHTML = parseInt(subtotalGeneral.textContent) + parseInt(costoEnvio.textContent);
        };
    };

    //Funcion que calcula subtotal de c/producto, trae su input cantidad segun su id, segun provenga del servidor o del localStorage
    function subtotalProductoYGeneral(articuloServidor, articulosStorage) {

        let precioUnidad = document.getElementById(`precioUnidad${articuloServidor.id}`);
        let inputCantidad = document.getElementById(`inputCantidad${articuloServidor.id}`);
        let subtotal = document.getElementById(`subtotal${articuloServidor.id}`);

        subtotalGeneral.innerHTML = sumaSubtotalesProductos(articuloServidor, articulosStorage);

        inputCantidad.addEventListener("input", () => {
            subtotal.innerHTML = inputCantidad.value * parseInt(precioUnidad.textContent);
            subtotalGeneral.innerHTML = sumaSubtotalesProductos(articuloServidor, articulosStorage);
            porcentajeCostoEnvio(btnPremium, 0.15)
            porcentajeCostoEnvio(btnExpress, 0.07);
            porcentajeCostoEnvio(btnStandard, 0.05);
        });

        for (let articulo of Object.values(articulosStorage)) {

            let precioUnidad2 = document.getElementById(`precioUnidad${articulo.id}`);
            let inputCantidad2 = document.getElementById(`inputCantidad${articulo.id}`);
            let subtotal2 = document.getElementById(`subtotal${articulo.id}`);

            subtotal2.innerHTML = inputCantidad2.value * parseInt(precioUnidad2.textContent);

            inputCantidad2.addEventListener("input", () => {
                subtotal2.innerHTML = inputCantidad2.value * parseInt(precioUnidad2.textContent);
                subtotalGeneral.innerHTML = sumaSubtotalesProductos(articuloServidor, articulosStorage);
                porcentajeCostoEnvio(btnPremium, 0.15)
                porcentajeCostoEnvio(btnExpress, 0.07);
                porcentajeCostoEnvio(btnStandard, 0.05);
            });
        };
    };

    //Funcion para deshabilitar campos del modal
    function desactivarCamposModal() {
        inputNumTarjeta.disabled = true
        inputCodeTarjeta.disabled = true
        inputVencimiento.disabled = true
        inputNumCuenta.disabled = true

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

    //Procedimiento que imprime toda la informacion necesaria en pantalla
    function productosCarrito() {
        carrito_tbody.innerHTML = HTMLCarrito(articulo_carrito[0], JSON.parse(localStorage.getItem("Carrito")));
        subtotalProductoYGeneral(articulo_carrito[0], JSON.parse(localStorage.getItem("Carrito")));

        eliminarProducto(articulo_carrito[0], JSON.parse(localStorage.getItem("Carrito")));

        //Eventos a inputs radio de costo envio
        btnPremium.addEventListener("input", () => {
            porcentajeCostoEnvio(btnPremium, 0.15);
        });

        btnExpress.addEventListener("input", () => {
            porcentajeCostoEnvio(btnExpress, 0.07);
        });

        btnStandard.addEventListener("input", () => {
            porcentajeCostoEnvio(btnStandard, 0.05);
        });

        desactivarCamposModal();
    };

    productosCarrito();

    //Si el campo especificado se encuentra vacio, agregar a ese input clase "is-invalid" para dar feedback, y paramos el evento de submit del formulario
    function invalidFeedbackInput(input, evento) {
        if (input.value == "") {
            validar = false
            input.classList.add("is-invalid");

            evento.preventDefault();
            evento.stopPropagation();
        };
    };

    //Validaciones del formulario
    document.getElementById("formulario").addEventListener("submit", (evento) => {
        const calle = document.getElementById("calle");
        const numCalle = document.getElementById("numCalle");
        const esquina = document.getElementById("esquina");
        const inputsCantidad = carrito_tbody.getElementsByTagName("input");

        let validar = true

        invalidFeedbackInput(calle, evento);
        invalidFeedbackInput(numCalle, evento);
        invalidFeedbackInput(esquina, evento);

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
            invalidFeedbackInput(inputNumTarjeta, evento);
            invalidFeedbackInput(inputCodeTarjeta, evento);
            invalidFeedbackInput(inputVencimiento, evento);
        };

        if (transferencia.checked) {
            invalidFeedbackInput(inputNumCuenta, evento)
        };

        if (validar) {
            document.getElementById("alert").classList.remove("d-none");
            evento.preventDefault();
            evento.stopPropagation();
        };
    });
});