// Requires
var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicialización de variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



// Importación de rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");

// Conexión a la BD
mongoose.connection.openUri("mongodb://localhost:27017/hospital", (err, res) => {

    if (err) throw err; // Se detiene todo el proceso (servidor)

    console.log("Connection to database succesfully");
});

// Levantando el puerto
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});


// Rutas
app.use("/", appRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/login", loginRoutes);
