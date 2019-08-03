var express = require("express");
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

var app = express();

// Búsqueda por colección
app.get("/coleccion/:coleccion/:busqueda", (req, res) => {
  var coleccion = req.params.coleccion;
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i"); // Convierto a expresión regular
  var promesa;

  if (coleccion === "hospitales") {
    promesa = buscarHospitales(busqueda, regex);
  } else if (coleccion === "medicos") {
    promesa = buscarMedicos(busqueda, regex);
  } else if (coleccion === "usuarios") {
    promesa = buscarUsuarios(busqueda, regex);
  } else {
    res.status(400).json({
      message: "No se ha podido realizar la búsqueda",
      error: { message: "Tipo de tabla/colección no válida o no existente" },
      ok: false
    });
  }

  promesa.then(data => {
    res.status(200).json({
      [coleccion]: data,
      ok: true
    });
  });
});

// Búsqueda general
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i"); // Convierto a expresión regular

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuarios(busqueda, regex)
  ]).then(resultados => {
    // resultados es un array de todos los res de cada promesa
    res.status(200).json({
      hospitales: resultados[0],
      medicos: resultados[1],
      usuarios: resultados[2],
      ok: true
    });
  });
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al encontrar los hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .populate("hospital")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al encontrar los medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find()
      .or({ nombre: regex, email: regex })
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al buscar los usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
