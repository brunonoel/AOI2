const table = document.getElementById("productosTable"); // OBTENEMOS EL ELEMENTO TABLA
const form = document.getElementById("registroForm"); // OBTENEMOS EL ELEMENTO FORM

cargarProductosFromStorage();  // CARGAMOS LOS PRODUCTOS QUE REGISTRAMOS EN LA SESION ANTERIOR

// CUANDO SE HACE CLIC EN EL BOTN SUBMIT DEL FORM SE GENERA UN EVENTO SUBMIT QUE SE MANEJA CON ESTE METODO
function manejadorEnvioFormulario(event)  // FUNCION PARA MANEJAR EL EVENTO SUBMIT DEL FORMULARIO
{  
  event.preventDefault(); // EVITAMOS QUE SE EJECUTE EL ENVIO DEL FORM (EN ESTE CASO NO QUEREMOS ENVIAR NADA)
  
  // CAPTURAMOS LOS DATOS QUE SE HAN REGISTRADO

  const codigo = document.getElementById("codigo").value; 
  const descripcion = document.getElementById("descripcion").value;
  const marca = document.getElementById("marca").value;
  const precio = document.getElementById("precio").value;
  const cantidad = document.getElementById("cantidad").value;
  const iva = document.getElementById("iva").value;
  

  // CREAMOS UN OBJETO PRODUCTO,QUE TIENE COMO ATRIBUTOS LAS CONSTANTES QUE ACABAMOS DE CAPTURAR DEL FORM

  const producto = {
    codigo,
    descripcion,
    marca,
    precio,
    cantidad,
    iva
  };

 // CALCULAMOS EL SUBTOTAL 
  producto.subtotal = ((precio*cantidad)+(precio*cantidad)*iva / 100);
  agregarProductoToTable(producto);   // AGREGAMOS EL PRODUCTO A LA TABLA
  guardarProductoToStorage(producto); // GURDAMOS EL PRODUCTO EN EL ALMACENAMIENTO LOCAL
  form.reset();                   // LIMPIAMOS EL FORMULARIO
  
} // FIN MANEJADOR EVENTO SUBMIT

 

function agregarProductoToTable(producto) 
{
  const row = table.insertRow(); // INSERTAMOS UNA FILA EN LA TABLA
 
  // CREAMOS UN ARRAY DE CELDAS CON LOS DATOS DEL PRODUCTO 
  const cells = [
    producto.codigo,
    producto.descripcion,
    producto.marca,
    producto.precio,
    producto.cantidad,
    producto.iva,
    producto.subtotal,
  
  ];

    cells.forEach(
                   (cellValue, index) => { // decimos que hacer con el valor y el indice de la celda
                                          const cell = row.insertCell();
                                          cell.textContent = cellValue;

                                          if (index === cells.length - 1 && parseFloat(cellValue) <= 7 ) {
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
          llenarFormularioConProducto(producto);  // cargamos los datos del producto en el form
          borrarProductoFromStorage(producto);    // borramos el producto del localstorage
          table.deleteRow(row.rowIndex);      // eliminamos la fila con el alumno de la tabla
        }
  );

  accionesCell.appendChild(editarButton);   // agregamosel botón editar

  const eliminarButton = crearButton("Eliminar", "btn-danger", () => {
          table.deleteRow(row.rowIndex);
          borrarProductoFromStorage(producto);
        }
  );
  accionesCell.appendChild(eliminarButton);     // agregamos el botón borrar
}



function crearButton(text, className, onClick) 
{
  const button = document.createElement("button"); // CREAMOS UN ELEMENTO DE TIPO BOTON
  button.textContent = text; // ANEXAMOS EL TEXTO
  button.className = `btn ${className}`; // ANEXAMOS LA CLASE PARA EL ESTILO DEL BOTON (USAMOS UNA CLASE DE BOOTSTRAP)
  button.addEventListener("click", onClick); // AGREGAMOS UN EVENTO, EN ESTE CASO CLICK
  return button;
}

// CARGAMOS LOS PRODUCTOS ALMACENADOS EN LOCALSTORAGE
function cargarProductosFromStorage() 
{
  const listaProductos = obtenerProductosFromStorage(); // buscamos los productos registrados en el localStorage
  if (listaProductos) {
      listaProductos.forEach(agregarProductoToTable); // RECORREMOS EL ARRAY DE PRODUCTOS CON FOR EACH Y LOS AGREGAMOS A LA TABLA
  }
}

//RECUPERAMOS LOS PRODUCTOS DESDE LOCAL STORAGE
function obtenerProductosFromStorage() 
{
  const productosJSON = localStorage.getItem("productos"); // si hat productos, están guardados en formato JSON
  return productosJSON ? JSON.parse(productosJSON) : [];  // parseamos lo obtenido para transformar JSON A JAVASCRIPT OBJECT
}

// GUARDAR PRODUCTOS EN EL LOCALSTORAGE
function guardarProductoToStorage(producto) 
{
  const productos = obtenerProductosFromStorage(); // RECUPERAMOS LOS PRODUCTOS YA GUARDADOS
  productos.push(producto); // AGREGAMOS EL NUEVO PRODUCTO
  localStorage.setItem("productos", JSON.stringify(productos)); // VOLVEMOS A GUARDAR EL LISTADO EN FORMATO JSON
}

// BORRA PRODUCTO DEL LOCALSTORAGE
function borrarProductoFromStorage(producto) 
{
  const productos = obtenerProductosFromStorage(); // RECUPERAMOS LOS PRODUCTOS YA GUARDADOS
  const index = productos.findIndex(a =>         // ENCUENTRO EL INDICE DEL PRODUCTO QUE QUIERO BORARR
    Object.entries(a).every(([key, value]) => producto[key] === value)
  );

  if (index !== -1) { // SI EL INDICE ES DISTINTO DE -1, QUIERE DECIR QUE ENCONTRO EL PRODUCTO
    productos.splice(index, 1); // USO SPLICE PARA ELIMINAR ESE DATO
    localStorage.setItem("productos", JSON.stringify(productos)); // VUELVO A GURADAR EL LISTADO, AHORA SIN EL PRODUCTO
  }
}

// TRANSFERIMOS LOS DATOS DEL PRODUCTO A EDITAR AL FORMULARIO
function llenarFormularioConProducto(producto) 
{
  document.getElementById("codigo").value = producto.codigo
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("marca").value = producto.marca;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("cantidad").value = producto.cantidad;
  document.getElementById("iva").value = producto.iva;
}


function registrarProducto()  // FUNCON PARA MANEJAR EL EVENTO SUBMIT DEL FORMULARIO
{

  
 // CAPTURAMOS LOS DATOS QUE SE HAN REGISTRADO

 

  const codigo = document.getElementById("codigo").value; 
  const descripcion = document.getElementById("descripcion").value;
  const marca = document.getElementById("marca").value;
  const precio = document.getElementById("precio").value;
  const cantidad = document.getElementById("cantidad").value;
  const iva = document.getElementById("iva").value;

  // CREAMOS UN OBJETO PRODUCTO

  const producto = {
    codigo,
    descripcion,
    marca,
    precio,
    cantidad,
    iva
  };

 // CALCULAMOS EL SUBTOTAL 
  producto.subtotal = ((precio*cantidad)+(precio*cantidad)*iva / 100).toFixed(2);
  agregarProductoToTable(producto);   // AGREGAMOS EL PRODUCTO A LA TABLA
  guardarProductoToStorage(producto); // GURDAMOS EL PRODUCTO EN EL ALMACENAMIENTO LOCAL
  form.reset();                   // LIMPIAMOS EL FORMULARIO
  alert('El Producto: ' + producto.codigo + ', ' + producto.descripcion + ' se registrO correctamente !!');
} // FIN MANEJADOR EVENTO SUBMIT

//Calculo del total

