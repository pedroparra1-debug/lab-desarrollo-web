document.addEventListener("DOMContentLoaded",()=>{
const rol=localStorage.getItem('userrole')||'Encargado';
const textoRol=document.getElementById("rol-display");
if(textoRol){
    textoRol.textContent=rol;
}
const formCliente=document.getElementById("formulario-cliente");
const inputNombre=document.getElementById("nombre-cliente");    
const inputRut=document.getElementById("rut-cliente");
const inputBuscar=document.getElementById("filtrar-clientes");
const tablaClientesBody=document.querySelector(".tabla-clientes tbody");
if(formCliente){
    formCliente.addEventListener("submit",(event)=>{
        event.preventDefault();
        const nombre=inputNombre.value.trim();
        const rut=inputRut.value.trim();
        if(nombre===""||rut===""){
            alert("Por favor, complete todos los campos.");
            return;
        }
        const nuevafila=document.createElement("tr");
        nuevafila.innerHTML=`
            <td>${nombre}</td>
            <td>${rut}</td>
            <td>
        <button class="btn-accion editar-cliente">Editar</button>
        <button class="btn-accion apagar eliminar-cliente">Eliminar</button></td>
        `;
        tablaClientesBody.appendChild(nuevafila);
        formCliente.reset();
        alert("Cliente agregado exitosamente.");
});
}

if(tablaClientesBody){
    tablaClientesBody.addEventListener("click",(event)=>{
        if(event.target.classList.contains("eliminar-cliente")){
            const fila=event.target.closest("tr");
            if(confirm("¿Está seguro de que desea eliminar este cliente?")){
                fila.remove();
                alert("Cliente eliminado exitosamente.");
            }
        }else if(event.target.classList.contains("editar-cliente")){
            const fila=event.target.closest("tr");
            const celdas=fila.querySelectorAll("td");
            const nombreActual=celdas[0].textContent;
            const rutActual=celdas[1].textContent;
            const nuevoNombre=prompt("Ingrese el nuevo nombre del cliente:",nombreActual);
            const nuevoRut=prompt("Ingrese el nuevo RUT del cliente:",rutActual);
            if(nuevoNombre!==null&&nuevoRut!==null){
                celdas[0].textContent=nuevoNombre.trim();
                celdas[1].textContent=nuevoRut.trim();
                alert("Cliente editado exitosamente.");
            }
}
    });
}

if(inputBuscar){
    inputBuscar.addEventListener("input",(event)=>{
        const textoBusqueda=inputBuscar.value.toLowerCase();
        const filas=tablaClientesBody.querySelectorAll("tr");
        filas.forEach((fila)=>{
            const nombre=fila.cells[0].textContent.toLowerCase();
            const rut=fila.cells[1].textContent.toLowerCase();
            if(nombre.includes(textoBusqueda)||rut.includes(textoBusqueda)){
                fila.style.display="";
            }else{
                fila.style.display="none";
            }
        });
    });
}
});