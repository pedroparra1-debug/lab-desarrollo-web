document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el rol guardado en localStorage (por defecto 'Encargado')
    const rol = localStorage.getItem('userrole') || 'Encargado';

    // 2. Mostrar el rol en el header de main.html
    const textoRol = document.querySelector(".Usuario p strong");
    if (textoRol) {
        textoRol.textContent = rol;
    }

    // 3. Si ingresó como Encargado, ocultamos las secciones de Admin
    if (rol === "Encargado") {
        // Ocultar Administración de Servicios Extras
        const moduloAdminServ = document.getElementById("mod-admin-serv");
        if (moduloAdminServ) {
            moduloAdminServ.style.display = "none";
        }

        // Ocultar botones de apagar/reiniciar en las PCs
        const botonesApagar = document.querySelectorAll(".apagar");
        botonesApagar.forEach(btn => {
            btn.style.display = "none";
        });

        // Ocultar la tarjeta de Recaudación total
        const seccionMetricas = document.querySelector(".Metricas");
        if (seccionMetricas) {
            seccionMetricas.style.display = "none";
        }
    }
});