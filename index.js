const express = require('express');
const cors = require('cors');
const { dbconn } = require('./database/config');
// Paquete para ayudarnos a obtener las variables
// de entorno en el archivo .env y otras adicionales
// const dotenv = require('dotenv');
require('dotenv').config();
// para acceder a las variables de entorno
// usamos la sentencia process.env


// Crear el servidor de express
const app = express();

// Base de datos
dbconn();

// Habilitar el CORS
app.use(cors());

// Rutas
// esta forma no se usa, se recomienda crear un directorio routes
// app.get('/', (req, res) => {
//     console.log('se requiere el /');
//     res.json({
//         ok:true
//     })
// });

// Ruta publica
// app.use() es para implementar middlewares
// express.static() es para que apunte a la carpeta public
app.use(express.static('public'));

// Lectura y parseo del BODY
// donde vienen todas la informacion del POST
app.use(express.json());

/**
 * OJO
 * Si la sentencia app.use(express.json()); la colocamos
 * despues de la sentencia app.use('/api/auth', require('./routes/auth'));
 * nos va el valor de undefined en el req.body
 */

// Apuntar al router de autenticacion
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Escuchar peticiones
app.listen(80, () => {
    console.log(`Servidor correindo en puerto ${ process.env.PORT }`);
});