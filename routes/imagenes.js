var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

app.get("/:tipo/:img", (req, res) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // __dirname contiene el path de donde estoy parado, independientemente si la app está en un server o en local
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`); 

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;