const table = document.getElementById("productosTable"); // OBTENEMOS EL ELEMENTO TABLA
const form = document.getElementById("registroForm"); // OBTENEMOS EL ELEMENTO FORM

cargarProductosFromStorage();  // CARGAMOS LOS ALUMNOS QUE REGISTRAMOS EN LA SESION ANTERIOR

// CUANDO SE HACE CLIC EN EL BOTN SUBMIT DEL FORM SE GENERA UN EVENTO SUBMIT QUE SE MANEJA CON ESTE METODO
function manejadorEnvioFormulario(event)  // FUNCION PARA MANEJAR EL EVENTO SUBMIT DEL FORMULARIO
{  
  event.preventDefault(); // EVITAMOS QUE SE EJECUTE EL ENVIO DEL FORM (EN ESTE CASO NO QUEREMOS ENVIAR NADA)
  
  // CAPTURAMOS LOS DATOS QUE SE HAN REGISTRADO

  const codigo = document.getElementById("codigo").value; 
  const descripcion = document.getElementById("descripcion").value;
  const marca = document.getElementById("marca").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const iva = document.getElementById("iva").value;
  

  // CREAMOS UN OBJETO ALUMNO,QUE TIENE COMO ATRIBUTOS LAS CONSTANTES QUE ACABAMOS DE CAPTURAR DEL FORM

  const producto = {
    codigo,
    descripcion,
    marca,
    precio,
    cantidad,
    iva
  };

 // CALCULAMOS EL PROMEDIO 
  producto.subtotal = ((precio*cantidad)+(precio*cantidad)*iva / 100).toFixed(2);
  agregarProductoToTable(producto);   // AGREGAMOS EL ALUMNO A LA TABLA
  guardarProductoToStorage(producto); // GURDAMOS EL ALUMNO EN EL ALMACENAMIENTO LOCAL
  form.reset();                   // LIMPIAMOS EL FORMULARIO
} // FIN MANEJADOR EVENTO SUBMIT

 

function agregarProductoToTable(producto) 
{
  const row = table.insertRow(); // INSERTAMOS UNA FILA EN LA TABLA
  // los elementos tabla en javascript poseen una serie de métodos
  // entre ellos insertRow que agrega una nueva fila a la tabla
  // a su vez el objeto fila (Row) posee un método insertCell para agregar una nueva celda
  // CREAMOS UN ARRAY DE CELDAS CON LOS DATOS DEL ALUMNO  
  const cells = [
    producto.codigo,
    producto.descripcion,
    producto.marca,
    producto.precio,
    producto.cantidad,
    producto.iva,
    producto.subtotal
  ];
    
   // como cells es un array, usamos el método forEach que recorre cada uno de los elementos
   // mientras recorre los elementos aplica las acciones que pasamos con la funcion flecha 
   // que tiene dos variables cellValue ( el valor de la celda ) e index (el indice de la celda)
   // Este bloque diria : recorre cada elemento de la celda, toma el valor y el indica de la celda y 
   // haz lo siguiente:

    cells.forEach(
                   (cellValue, index) => { // decimos que hacer con el valor y el indice de la celda
                                          const cell = row.insertCell();
                                          cell.textContent = cellValue;

                                          if (index === cells.length - 1 && parseFloat(cellValue) < 7) {
                                            cell.style.backgroundColor = 'orangered';
                                            cell.style.color='white';
                                            cell.style.fontWeight='bold';
                                          } 
                                          
                                          if (index === cells.length - 1 && parseFloat(cellValue) >= 7) {
                                            cell.style.backgroundColor = 'limegreen';
                                            cell.style.color='white';
                                            cell.style.fontWeight='bold';
                                          } 

                                          }
                    ); // fin del lazo forEach




  // AHORA INSERTAMOS OTRA CELDA PARA COLOCAR LOS BOTONES EDITAR Y ELIMINAR
  const accionesCell = row.insertCell();
  
  // llamamos a la funcion crearBoton

  const editarButton = crearButton("Editar", "btn-warning", () => {
          llenarFormularioConProducto(producto);  // cargamos los datos del alumno en el form
          borrarProductoFromStorage(producto);    // borramos el alumno del localstorage
          table.deleteRow(row.rowIndex);      // eliminamos la fila con el alumno de la tabla
        }
  );

  accionesCell.appendChild(editarButton);   // agregamosel botón editar

  const eliminarButton = crearButton("Eliminar", "btn-danger", () => {
          table.deleteRow(row.rowIndex);
          borrarProdcutoFromStorage(producto);
        }
  );
  accionesCell.appendChild(eliminarButton);     // agregamos el botón borrar
}

// FUNCION PARA CREAR UN BOTON. CON LAS MODIFICACIONES DEL CASO PODEMOS USARLA 
// PARA CREAR CUALQUIER ELEMENTO HTML

// ESTA FUNCION RECIBE 3 PARAMETROS, EL TEXTO DEL BOTON, LA CLASE ( PARA DEFINIR EL ESTILO), 
// Y LA FUNCION QUE SE EJECUTARÁ CUANDO OCURRA UN EVENTO EN EL COMPONENTE, EN ESTE CASO EL EVENTO ONCLICK

function crearButton(text, className, onClick) 
{
  const button = document.createElement("button"); // CREAMOS UN ELEMENTO DE TIPO BOTON
  button.textContent = text; // ANEXAMOS EL TEXTO
  button.className = `btn ${className}`; // ANEXAMOS LA CLASE PARA EL ESTILO DEL BOTON (USAMOS UNA CLASE DE BOOTSTRAP)
  button.addEventListener("click", onClick); // AGREGAMOS UN EVENTO, EN ESTE CASO CLICK
  return button;
}

// CARGAMOS LOS ALUMNOS ALMACENADOS EN LOCALSTORAGE
function cargarProductosFromStorage() 
{
  const listaProductos = obtenerProductosFromStorage(); // buscamos los alumnos registrados en el localStorage
  if (listaProductos) {
      listaProductos.forEach(agregarProductoToTable); // RECORREMOS EL ARRAY DE ALUMNOS CON FOR EACH Y LOS AGREGAMOS A LA TABLA
  }
}

//RECUPERAMOS LOS ALUMNOS DESDE LOCAL STORAGE
function obtenerProductosFromStorage() 
{
  const productosJSON = localStorage.getItem("productos"); // si hat alumnos, están guardados en formato JSON
  return productosJSON ? JSON.parse(productosJSON) : [];  // parseamos lo obtenido para transformar JSON A JAVASCRIPT OBJECT
}

// GUARDAR ALUMNOS EN EL LOCALSTORAGE
function guardarProductoToStorage(producto) 
{
  const productos = obtenerProductosFromStorage(); // RECUPERAMOS LOS ALUMNOS YA GUARDADOS
  productos.push(producto); // AGREGAMOS EL NUEVO ALUMNO
  localStorage.setItem("productos", JSON.stringify(productos)); // VOLVEMOS A GUARDAR EL LISTADO EN FORMATO JSON
}

// BORRA ALUMNO DEL LOCALSTORAGE
function borrarProductoFromStorage(producto) 
{
  const productos = obtenerProductosFromStorage(); // RECUPERAMOS LOS ALUMNOS YA GUARDADOS
  const index = productos.findIndex(a =>         // ENCUENTRO EL INDICE DEL ALUMNO QUE QUIERO BORARR
    Object.entries(a).every(([key, value]) => producto[key] === value)
  );

  if (index !== -1) { // SI EL INDICE ESDISTINTO DE -1, QUIERE DECIR QUE ENCONTRO EL ALUMNO
    productos.splice(index, 1); // USO SPLICE PARA ELIMINAR ESE DATO
    localStorage.setItem("productos", JSON.stringify(productos)); // VUELVO A GURADAR EL LISTADO, AHORA SIN EL ALUMNO
  }
}

// TRANSFERIMOS LOS DATOS DEL ALUMNO A EDITAR AL FORMULARIO
function llenarFormularioConProducto(producto) 
{
  document.getElementById("codigo").value = producto.codigo
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("marca").value = producto.marca;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("cantidad").value = producto.cantidad;
  document.getElementById("iva").value = producto.iva;
}
 // ESTA FUNCION NO LA ESTAMOS USANDO, SI QUISIERAMOS USARLA, HAY QUE CAMBIAR EL BOTON SUBMIT 
 // POR UN BOTON ESTANDAR (BUTTON) Y EN VEZ DE USAR EL EVENTO SUBMIT, USAR ESTA FUNCION EN EL EVENTO ONCLICJ DEL BOTON
// funcion para manejar para registrar el alumno, si en evz de usar submit, usamos click

function registrarProducto()  // FUNCON PARA MANEJAR EL EVENTO SUBMIT DEL FORMULARIO
{
 // event.preventDefault(); // EVITAMOS QUE SE EJECUTE EL ENVIO DEL FORM (EN ESTE CASO NO QUEREMOS ENVIAR NADA)
  
  // CAPTURAMOS LOS DATOS QUE SE HAN REGISTRADO

 

  const codigo = document.getElementById("codigo").value; 
  const descripcion = document.getElementById("descripcion").value;
  const marca = document.getElementById("marca").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const iva = document.getElementById("iva").value;

  // CREAMOS UN OBJETO ALUMNO

  const producto = {
    codigo,
    descripcion,
    marca,
    precio,
    cantidad,
    iva
  };

 // CALCULAMOS EL PROMEDIO 
  producto.subtotal = ((precio*cantidad)+(precio*cantidad)*iva / 100).toFixed(2);
  agregarProductoToTable(producto);   // AGREGAMOS EL ALUMNO A LA TABLA
  guardarProductoToStorage(producto); // GURDAMOS EL ALUMNO EN EL ALMACENAMIENTO LOCAL
  form.reset();                   // LIMPIAMOS EL FORMULARIO
  alert('El Producto: ' + producto.codigo + ', ' + producto.descripcion + ' se registrO correctamente !!');
} // FIN MANEJADOR EVENTO SUBMIT

//Calculo del total
total = eval(totaltext.value);
totaltext.value = total + producto.subtotal;