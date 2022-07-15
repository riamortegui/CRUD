
/* Declaración de variables. */
const url = 'http://localhost:3000/api/platillos/';
const contenedor = document.querySelector('tbody');
let resultados = '';

const modalPlatillos = new bootstrap.Modal(document.getElementById('modalPlatillos'))
const formPlatillos = document.querySelector('form');
const plato = document.getElementById('plato');
const descripcion = document.getElementById('descripcion');
const precio = document.getElementById('precio');
let opcion = '';


/* Un detector de eventos que está escuchando un clic en el botón con la identificación de btnCrear.
Cuando se hace clic en el botón, se muestra el modal modalPlatillos y la variable opción se
establece en crear. */
btnCrear.addEventListener('click', ()=>{

    modalPlatillos.show();
    opcion = 'crear'
})


const mostrar = (platillos) =>{
   platillos.forEach(platillo =>{ 
    resultados += `<tr>
                       <td>${platillo.id}</td>
                       <td>${platillo.plato}</td>
                       <td>${platillo.descripcion}</td>
                       <td>${platillo.precio}</td>
                       <td class="text-center"><a class="btnEditar btn ">Actualizar</a>  <a class="btnBorrar btn btn-danger">Eliminar</a></td>
                   </tr>         
                `
    })
    contenedor.innerHTML = resultados 
}



/* Obtiene los datos de la url y luego convierte la respuesta a json y luego llama a la función mostrar
y le pasa los datos. */
fetch(url)
   .then(response => response.json())
   .then(data => mostrar(data))
   .catch(error => console.log(error))



/**
 * La función on toma un elemento, un evento, un selector y un controlador, y agrega un detector de
 * eventos al elemento que escucha el evento, y cuando se activa el evento, verifica si el objetivo del
 * evento coincide con el selector y si lo hace, llama al controlador.
 * @param element - El elemento al que adjuntar el evento.
 * @param event - El evento que desea escuchar.
 * @param selector - El selector con el que coincidir (un selector CSS, no un selector zepto).
 * @param handler - la función que se llamará cuando se active el evento
 */
const on = (element, event, selector, handler) =>{

    element.addEventListener(event, e =>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}   

/* Una función que está escuchando un clic en el botón con la clase btnBorrar. Cuando se hace clic en
el botón, muestra un cuadro de diálogo de confirmación. Si el usuario hace clic en Aceptar, elimina
los datos de la base de datos y vuelve a cargar la página. Si el usuario hace clic en cancelar,
muestra un mensaje de error. */
on(document, 'click', '.btnBorrar', e =>{
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("¿Esta seguro que desea eliminar este Plato?",
    
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json())
        .then( ()=> location.reload())
    },
    function(){
        alertify.error('Cancelar')
    })

})



let idForm = 0
/* Metodo Editar */
on(document, 'click', '.btnEditar', e =>{
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const platoForm = fila.children[1].innerHTML
    const descripcionForm = fila.children[2].innerHTML
    const precioForm = fila.children[3].innerHTML
    plato.value = platoForm
    descripcion.value = descripcionForm
    precio.value = precioForm
    opcion = 'editar'
    modalPlatillos.show()

})


/* Creación de un nuevo objeto en la base de datos. */
formPlatillos.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                plato:plato.value,
                descripcion:descripcion.value,
                precio:precio.value
            })
        })
        .then(response => response.json())
        .then(data =>{
            const nuevoPlatillo = []
            nuevoPlatillo.push(data)
            mostrar(nuevoPlatillo)
        }) 
    }

  /* El código anterior es una función que se llama cuando el usuario hace clic en el botón "Guardar"
  en el modal. */
    if(opcion=='editar'){
        fetch(url+idForm,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                plato:plato.value,
                descripcion:descripcion.value,
                precio:precio.value
            })    
        })
        .then(response => response.json())
        .then(response => location.reload())
    }
    modalPlatillos.hide()
})
