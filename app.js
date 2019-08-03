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
var hospitalRoutes = require("./routes/hospital");
var medicoRoutes = require("./routes/medico");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload.js");
var imgRoutes = require("./routes/imagenes.js");

// Conexión a la BD
mongoose.connect('mongodb://localhost:27017/hospital', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection to database succesfully");
});

// Levantando el puerto
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});


// Rutas
app.use("/usuarios", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/medico", medicoRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imgRoutes);
app.use("/", appRoutes);
