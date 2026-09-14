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

const contadorEquiposActivos = document.querySelector('#Equipos-activos');
const recaudacionEl = document.querySelector('#Recaudacion-total');
const tarjetasPC = document.querySelectorAll('.pcs');
    
    let clientes = [];
    let recaudacionTotal = 0;
    let equiposActivos = 0;

    tarjetasPC.forEach((pc) => {
        const selectorCliente = pc.querySelector('.cliente-selecionado');
        const inputTiempo = pc.querySelector('.tiempo-input');
        const selectUnidad = pc.querySelector('.unidad');
        const costoTexto = pc.querySelector('.costo');
        const estadoTexto = pc.querySelector('.disponible');
        const cronometroTexto = pc.querySelector('.cronometro');
        const btnIniciar = pc.querySelector('.iniciar');
        const btnApagar = pc.querySelector('.apagar');
 
            let intervaloActivo = null;
            let segundosRestantes = 0;
            let costoActual = 0;
            let sesionActiva = false;
 
        function actualizarCronometro() {
            const horas = Math.floor(segundosRestantes / 3600);
            const minutos = Math.floor((segundosRestantes % 3600) / 60);
            const segundosR = segundosRestantes % 60;
 
            const horaStr = String(horas).padStart(2, '0');
            const minutoStr = String(minutos).padStart(2, '0');
            const segundoStr = String(segundosR).padStart(2, '0');
 
            cronometroTexto.textContent = `${horaStr}:${minutoStr}:${segundoStr}`;
        }
 
        function finalizarSesion() {
            clearInterval(intervaloActivo);
            intervaloActivo = null;
 
            estadoTexto.textContent = '--Disponible--';
            costoTexto.textContent = 'Costo: $0';
            cronometroTexto.textContent = '00:00:00';
 
            selectorCliente.disabled = false;
            selectorCliente.value = '';
            inputTiempo.disabled = false;
            inputTiempo.value = '';
            selectUnidad.disabled = false;
 
            if (sesionActiva) {
                sesionActiva = false;
                equiposActivos--;
                actualizarResumen();
            }
        }
 
        function actualizarResumen() {
            if (contadorEquiposActivos) {
                contadorEquiposActivos.textContent = `${equiposActivos}/4`;
            }
            if (recaudacionEl) {
                recaudacionEl.textContent = `${recaudacionTotal}$`;
            }
        }
 
        btnIniciar.addEventListener('click', () => {
            const tiempoIngresado = Number(inputTiempo.value);
 
            if (!tiempoIngresado || tiempoIngresado <= 0) {
                alert('Ingresa un tiempo válido antes de iniciar.');
                return;
            }
            if (!selectorCliente.value) {
                alert('Selecciona un cliente antes de iniciar.');
                return;
            }
            if (sesionActiva) {
                return;
            }
 
            if (selectUnidad.value === 'horas') {
                segundosRestantes = tiempoIngresado * 3600;
                costoActual = tiempoIngresado * 6000;
            } else {
                segundosRestantes = tiempoIngresado * 60;
                costoActual = tiempoIngresado * 100;
            }
 
            costoTexto.textContent = `Costo: $${costoActual}`;
            estadoTexto.textContent = '--Ocupado--';
            selectorCliente.disabled = true;
            inputTiempo.disabled = true;
            selectUnidad.disabled = true;
 
            sesionActiva = true;
            equiposActivos++;
            recaudacionTotal += costoActual;
            actualizarResumen();
 
            actualizarCronometro();
            intervaloActivo = setInterval(() => {
                segundosRestantes--;
                actualizarCronometro();
 
                if (segundosRestantes <= 0) {
                    finalizarSesion();
                }
            }, 1000);
        });

        if (btnApagar) {
            btnApagar.addEventListener('click', () => {
                if (sesionActiva) {
                    recaudacionTotal -= costoActual;
                    actualizarResumen();
                }
                finalizarSesion();
            });
        }
    });



});