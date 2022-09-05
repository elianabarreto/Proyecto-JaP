document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("boton").addEventListener("click", () => {

        let email = document.getElementById("email").value;
        let contraseña = document.getElementById("contraseña").value;
        let seCumple = true;

        function guardarDatos(){
            localStorage.setItem("Usuario", email);
        };

        if (email == "") {
            seCumple = false;
            alert ("Debe ingresar un email");
        };

        if (contraseña == "") {
            seCumple = false;
            alert ("Debe ingresar una contraseña");
        };

        if (seCumple) {
            guardarDatos();
            window.location = "index.html"; 
        };
    });
});