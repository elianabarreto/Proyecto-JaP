document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("boton").addEventListener("click", function () {

        let email = document.getElementById("email").value;
        let contraseña = document.getElementById("contraseña").value;
        let seCumple = true;

        if (email == "") {
            seCumple = false;
            alert ("Debe ingresar un email");
        };

        if (contraseña == "") {
            seCumple = false;
            alert ("Debe ingresar una contraseña");
        };

        if (seCumple) {
            window.location = "portada.html"; 
        };
    });
});