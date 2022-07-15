/* El código anterior está importando los módulos express y mysql. */
let express = require('express');
let mysql = require('mysql');
let cors = require('cors');





/* El código anterior está creando un servidor que escucha en el puerto 3000. */
let app = express();
app.use(express.json());
app.use(cors());

/* Creación de una conexión a la base de datos. */
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'restaurante_bd'
});

/* Conexión a la base de datos. */
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("La conexion a la base de datos a sido exitosa");
    }
});


/* Crear una ruta para que el servidor escuche. */
app.get('/', function(req,res){
    res.send('RUTA INICIO');
});

/* Escuchando el puerto 3000. */
app.listen(3000, function(){
  console.log("Servidor Listo");
});

//METODOS

/* Un método que está escuchando la ruta /api/platillos y está devolviendo todos datos de la tabla
platillos. */
app.get('/api/platillos', (req,res)=>{

    conexion.query('SELECT * FROM platillos', (error,filas)=>{
          
           if(error){
               throw error;
           }else{
               res.send(filas);
           }
       });
 });


 /* El código anterior es una solicitud GET que recupera un platillo específico de la base de datos. */
 app.get('/api/platillos/:id', (req,res)=>{

    conexion.query('SELECT * FROM platillos WHERE id = ?', [req.params.id], (error,fila)=>{ 
          
           if(error){
               throw error;
           }else{
               res.send(fila);
           }
       });
 });




 /* Esta es una solicitud POST que inserta un nuevo registro en la base de datos. */
 app.post('/api/platillos', (req,res)=>{
    let data = {plato:req.body.plato, descripcion:req.body.descripcion, precio:req.body.precio}
    let sql = "INSERT INTO platillos SET ?" ;
    conexion.query(sql, data, (error, resultado)=>{

        if(error){ 
            throw error;
        }else{
            Object.assign(data, {id: resultado.insertId})
            res.send(data)
        }
    });

 });



/* El código anterior está actualizando los datos en la base de datos. */
 app.put('/api/platillos/:id', (req,res)=>{

     let id = req.params.id;
     let plato = req.body.plato;
     let descripcion = req.body.descripcion;
     let precio = req.body.precio;
     let sql =  "UPDATE platillos SET plato = ?, descripcion= ?, precio= ? WHERE id = ?";
     
      conexion.query(sql, [plato,descripcion,precio,id], (error, resultados)=>{
        if(error){ 
            throw error;
        }else{
            res.send(resultados);
        }
      });
 });


 /* El código anterior está eliminando una fila de la base de datos. */
 app.delete('/api/platillos/:id', (req,res)=>{
    conexion.query('DELETE FROM platillos WHERE id = ?', [req.params.id], function(error,filas){
        if(error){ 
            throw error
        }else{
            res.send(filas);
        }
    })
})