// Requires
var express = require("express");
var mongoose = require('mongoose');

// Inicialización de variables
var app = express();

// Conexión a la BD
mongoose.connection.openUri("mongodb://localhost:27017/hospital", (err, res) => {
    if (err) throw err; // Se detiene todo el proceso (servidor)

    console.log("Connection to database succesfully", res);
});

// Levantando el puerto
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});


// Rutas
app.get("/", (req, res, next) => {

    res.status(200).json({
        mensaje: "Todo salió bien",
        ok: true
    })

})

