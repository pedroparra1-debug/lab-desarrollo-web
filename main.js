document.addEventListener("DOMContentLoaded", () => {
    function cargarSelectoresServicios(){
        const selects=document.querySelectorAll(".select-agregar-servicio");
        const listaServicios=JSON.parse(localStorage.getItem("servicios"))||[];
     selects.forEach(select=>{
            select.innerHTML=`<option value="">Agregar servicio</option>`;
         listaServicios.forEach(serv=>{
         const precioNumerico=parseInt(serv.precio.replace(/[^0-9]/g, ""))||0;
            const option=document.createElement("option");
         option.value=precioNumerico;
         option.textContent=`${serv.nombre} (${serv.precio})`;
         select.appendChild(option);
         });
     });
    }
    cargarSelectoresServicios(); 
    
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains("btn-sumar-servicio")){
            const tarjetaPC=event.target.closest(".pcs");
            const idPC=tarjetaPC.id;
            const selectServicio=tarjetaPC.querySelector(".select-agregar-servicio");
            const displayCosto=tarjetaPC.querySelector(".costo");
            const precioServicio = parseInt(selectServicio.value)||0;
            if(precioServicio===0) {
                alert("Por favor selecciona un servicio válido para sumar.");
                return;
            }
            const estadoactual=estadosesion[idPC];            
            if(!estadoactual.costoExtras){
             estadoactual.costoExtras=0;
            }
            estadoactual.costoExtras+=precioServicio;
            const mintotales=Math.ceil(estadoactual.segundostotales/60);
            const costoTiempo=mintotales*Tarifa_por_minuto;
            const costoTotalFinal=costoTiempo+estadoactual.costoExtras;
            displayCosto.textContent=`Costo: ${costoTotalFinal.toLocaleString()}$`;
            alert(`¡Servicio agregado exitosamentea ${tarjetaPC.querySelector("h3").textContent} por $${precioServicio.toLocaleString()}!`);
            selectServicio.value="";
    }   
    });
    const rol = localStorage.getItem('userrole') || 'Encargado';
    const textoRol=document.getElementById("rol-display");
    if (textoRol) {
        textoRol.textContent = rol;
    }
    if (rol === "Encargado") {
        const moduloAdminServ = document.getElementById("mod-admin-serv");
        if (moduloAdminServ) {
            moduloAdminServ.style.display = "none";
        }
        const botonesApagar = document.querySelectorAll(".apagar");
        botonesApagar.forEach(btn => {
            btn.style.display = "none";
        });
        const seccionMetricas = document.querySelector(".Metricas");
        if (seccionMetricas) {
            seccionMetricas.style.display = "none";
        }
    }
    const recaudacionTotal=parseFloat(localStorage.getItem("recaudacionTotal"))||0;
    const visorRecaudacion=document.getElementById("Recaudacion-total");
    if(visorRecaudacion){
        visorRecaudacion.textContent=`$${recaudacionTotal.toLocaleString()}`;
    }
    
const Tarifa_por_minuto=100;
const tarjetasPC=document.querySelectorAll(".pcs")
const equiposactivos=document.getElementById("Equipos-activos")
const historiallista=document.getElementById("historial-lista")

const estadosesion={}

tarjetasPC.forEach((tarjeta)=>{
    const idPC=tarjeta.id;
    const selectmodo=tarjeta.querySelector(".modo-seleccionado");
    const inputTiempo=tarjeta.querySelector(".tiempo-input");
    const selectUnidad=tarjeta.querySelector(".unidad");
    const displayCosto=tarjeta.querySelector(".costo");
    const displayCronometro=tarjeta.querySelector(".cronometro");
    const btnIniciar=tarjeta.querySelector(".iniciar");
    const btnReiniciar=tarjeta.querySelector(".apagar")

    tarjeta.classList.remove("disponible", "ocupado", "reservado", "desactivado");
    tarjeta.classList.add(selectmodo.value);

    estadosesion[idPC]={
        intervalo:null,
        segundosRestantes:0,
        segundostotales:0,
        enejecucion:false
    };

    selectmodo.addEventListener("change",()=>{
    const nuevoestado=selectmodo.value;
    tarjeta.classList.remove("disponible","ocupado","reservado","desactivado");
    tarjeta.classList.add(nuevoestado);
    actualizarequipos();
    });

    btnIniciar.addEventListener("click",()=>{
        const estadoactual=estadosesion[idPC];
        if(estadoactual.enejecucion){
        clearInterval(estadoactual.intervalo);
        estadoactual.enejecucion=false;
        btnIniciar.textContent="Reanudar";
        return;
        }
        if(estadoactual.segundosRestantes===0){
            const tiempoValor=parseInt(inputTiempo.value, 10);
            if(isNaN(tiempoValor)||tiempoValor<0){
                alert("eso es imposible, no existe el tiempo negativo xd.");
                return;
            }
            const enhoras=selectUnidad.value==="horas";
            let mintotales=enhoras ? tiempoValor*60:tiempoValor;
            estadoactual.segundostotales=mintotales*60;
            estadoactual.segundosRestantes=estadoactual.segundostotales;
        
            const costoT=mintotales*Tarifa_por_minuto;
            displayCosto.textContent=`costo: ${costoT.toLocaleString()}$`;
        }
    
        selectmodo.value="ocupado";
        selectmodo.dispatchEvent(new Event("change"));
        estadoactual.enejecucion=true;
        btnIniciar.textContent="Pausar";
        estadoactual.intervalo=setInterval(() => {
            estadoactual.segundosRestantes--;
            actualizarDisplayCronometro(displayCronometro, estadoactual.segundosRestantes);
        
            if(estadoactual.segundosRestantes<=0){
                clearInterval(estadoactual.intervalo);
                estadoactual.enejecucion=false;
                btnIniciar.textContent="iniciar";
                const h3t=tarjeta.querySelector("h3").textContent;
                const mintotales=Math.ceil(estadoactual.segundostotales/60);
                const extras = estadoactual.costoExtras || 0;
        const costoT = (mintotales * Tarifa_por_minuto) + extras;
        const fechaHoy = new Date().toISOString().split("T")[0];
        const nuevaseccion = {
            fecha: fechaHoy,
            cliente: "Cliente General",
            pc: h3t,
            tiempo: `${mintotales} minutos`,
            monto: `$${costoT.toLocaleString()}`
        };

        let historial = JSON.parse(localStorage.getItem("historial")) || [];
        historial.unshift(nuevaseccion);
        localStorage.setItem("historial", JSON.stringify(historial));

        let recaudacionTotal = parseFloat(localStorage.getItem("recaudacionTotal")) || 0;
        recaudacionTotal += costoT;
        localStorage.setItem("recaudacionTotal", recaudacionTotal);
        const visorRecaudacion = document.getElementById("recaudacion-display");
        if (visorRecaudacion) {
            visorRecaudacion.textContent = `$${recaudacionTotal.toLocaleString()}`;
        }

        Agregarhis(`${h3t}-sesion cerrada. Costo: $${costoT.toLocaleString()}`);
        selectmodo.value = "disponible";
        selectmodo.dispatchEvent(new Event("change"));
        alert(`tiempo terminado en ${h3t}. Costo total: $${costoT.toLocaleString()}`);
        estadoactual.costoExtras = 0;
                
            }
        }, 1000);
    });
    btnReiniciar.addEventListener("click",()=>{
        const estadoactual=estadosesion[idPC];
        if(estadoactual.intervalo){
            clearInterval(estadoactual.intervalo);
        }
        const h3t=tarjeta.querySelector("h3").textContent;
        estadoactual.intervalo=null;
        estadoactual.segundosRestantes=0;
        estadoactual.segundostotales=0;
        estadoactual.enejecucion=false;
        estadoactual.costoExtra = 0;
        displayCronometro.textContent="00:00:00";
        displayCosto.textContent="Costo: 0";
        inputTiempo.value="";
        btnIniciar.textContent="Iniciar";
        selectmodo.value="disponible";
        selectmodo.dispatchEvent(new Event("change"));
    });

});
    function actualizarDisplayCronometro(elemento, segundos){
        const seg=segundos%60;
        const min=Math.floor((segundos % 3600)/60)
        const hr=Math.floor(segundos/3600);
        const pad=(num)=>String(num).padStart(2,"0");
        elemento.textContent=`${pad(hr)}:${pad(min)}:${pad(seg)}`;
    }

    function actualizarequipos(){
        let acti=0;
        tarjetasPC.forEach((tarjeta)=>{
            const selectmodo=tarjeta.querySelector(".modo-seleccionado");
           if(selectmodo&&selectmodo.value==="ocupado"){
               acti++;
            }
         });
         const equiposacti=document.getElementById("Equipos-activos");
        if(equiposacti){
           equiposacti.textContent=`${acti}/${tarjetasPC.length}`;
        }
    }

    function Agregarhis(mensaje) {
    if(!historiallista){return;}
    if(historiallista.children.length===1&&historiallista.children[0].textContent.includes("No hay registros")){
        historiallista.innerHTML="";
    }
    const ahora=new Date();
    const horaformateada=ahora.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit', second: '2-digit'})
    const nuevoitem=document.createElement("li");
    nuevoitem.textContent=`[${horaformateada}] ${mensaje}`;
    historiallista.insertBefore(nuevoitem, historiallista.firstChild);
    }
});

