function redireccionar() {
    if (!localStorage.getItem("Usuario")) {
        window.location = "login.html";
    };
};

redireccionar();