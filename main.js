document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem('userrole') || 'Encargado';
    const textoRol = document.querySelector(".Usuario p strong");
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
                Agregarhis(`${h3t}-sesion cerrada.`);
                selectmodo.value="disponible";
                selectmodo.dispatchEvent(new Event("change"));
                alert(`tiempo terminado en ${h3t}`);
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
        if(equiposacti){
           equiposacti.textContent.value=`${acti}/${tarjetasPC.length}`;
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
    historiallista.insertBefore(nuevoitem, historiallista.firstChild);
    }
});