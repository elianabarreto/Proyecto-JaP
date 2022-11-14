let primerNombre = document.getElementById("primerNombre");
let segundoNombre = document.getElementById("segundoNombre");
let primerApellido = document.getElementById("primerApellido");
let segundoApellido = document.getElementById("segundoApellido");
let email = document.getElementById("email");
let telContacto = document.getElementById("telContacto");
let inputFile = document.getElementById("inputFile");
//Procedimiento para evaluar, si existe esa clave en localStorage, traer su valor al campo correspondiente
function guardarDatos(claveStorage, input){
    if (localStorage.getItem(`${claveStorage}`)) {
        input.value = localStorage.getItem(`${claveStorage}`)
    };
};

document.addEventListener("DOMContentLoaded", () => {

    //Campos obligatorios. Traemos valores del localStorage al campo que corresponde
    guardarDatos("PrimerNombre", primerNombre);
    guardarDatos("PrimerApellido", primerApellido);
    guardarDatos("Usuario", email);
    
    //Campos opcionales. Traemos valores del localStorage al campo que corresponde
    guardarDatos("SegundoNombre", segundoNombre);
    guardarDatos("SegundoApellido", segundoApellido);
    guardarDatos("TelContacto", telContacto);

    //Evento para encriptar url del archivo/imagen seleccionado y setearlo en localStorage
    inputFile.addEventListener("change", ()=> {
        const lector = new FileReader();
        lector.addEventListener("load", () => {
            localStorage.setItem("imagenDePerfil", lector.result)
        });
    
        lector.readAsDataURL(inputFile.files[0]);
    });

    //Si la imagen se encuentra en localStorage, traer url y pasarla como valor del atributo src
    if (localStorage.getItem("imagenDePerfil")) {
        document.getElementById("imgPerfil").setAttribute("src", localStorage.getItem("imagenDePerfil"));            
    };

    //Evento de submit al formulario del perfil de usuario
    document.getElementById("formPerfil").addEventListener("submit", (evento) => {

        //Si campo de PRIMER NOMBRE esta vacio, mostrar feedback y no enviar el formulario
        if (primerNombre.value == "") {
            primerNombre.classList.add("is-invalid");
            evento.preventDefault();
            evento.stopPropagation();
        } else {
            localStorage.setItem("PrimerNombre", primerNombre.value);
        };

        //Si campo de PRIMER APELLIDO esta vacio, mostrar feedback y no enviar el formulario
        if (primerApellido.value == "") {
            primerApellido.classList.add("is-invalid");
            evento.preventDefault();
            evento.stopPropagation();
        } else {
            localStorage.setItem("PrimerApellido", primerApellido.value);
        };

        //Si alguno de estos campos tiene valor, setearlo en localStorage
        if ((segundoNombre.value || segundoApellido.value || telContacto.value) !== "") {
            localStorage.setItem("SegundoNombre", segundoNombre.value);
            localStorage.setItem("SegundoApellido", segundoApellido.value);
            localStorage.setItem("TelContacto", telContacto.value);
        };

        //Si la imagen se encuentra en localStorage, traer url y pasarla como valor del atributo src
        if (localStorage.getItem("imagenDePerfil")) {
            document.getElementById("imgPerfil").setAttribute("src", localStorage.getItem("imagenDePerfil"));            
        };

        evento.preventDefault();
        evento.stopPropagation();
    });
});