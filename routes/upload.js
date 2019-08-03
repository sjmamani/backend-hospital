var express = require("express");
var fs = require("fs");
var fileUpload = require("express-fileupload");

var app = express();

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

// default options
app.use(fileUpload());

app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  var tiposValidos = ["medicos", "hospitales", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    res.status(400).json({
      message: "Tipo de colección no válida",
      errors: {
        message: "Las colecciones válidas son " + tiposValidos.join(", ")
      },
      ok: false
    });
  }

  if (!req.files) {
    res.status(400).json({
      message: "No se ha subido ninguna imagen",
      errors: { message: "Debe seleccionar una imagen para subir" },
      ok: false
    });
  }

  var archivo = req.files.imagen;
  var archivoCortado = archivo.name.split(".");
  var extension = archivoCortado[archivoCortado.length - 1];

  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    res.status(400).json({
      message: "Extensión de imagen no válida",
      errors: {
        message: "Las extensiones válidas son " + extensionesValidas.join(", ")
      },
      ok: false
    });
  }

  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Mover el archivo temporal a un path
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        message: "No se ha podido almacenar la imagen",
        errors: err,
        ok: false
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(500).json({
          ok: false,
          message: "No existe usuario con id ingresado",
          errors: err
        });
      }
      var pathViejo = "./uploads/usuarios/" + usuario.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, err => {
          if (err) {
            return res.status(400).json({
              ok: false,
              message: "No se pudo cargar la imagen",
              errors: err
            });
          }
        });
      }

      usuario.img = nombreArchivo;

      usuario.save((err, usuarioActualizado) => {
        usuarioActualizado.password = null;
        return res.status(200).json({
          message: "Imagen actualizada",
          usuario: usuarioActualizado,
          ok: true
        });
      });
    });
  }
  if (tipo === "medicos") {
    Medico.findById(id, (err, medico) => {
      if (!medico) {
        return res.status(500).json({
          ok: false,
          message: "No existe médico con id ingresado",
          errors: err
        });
      }

      var pathViejo = "./uploads/medicos/" + medico.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, err => {
          if (err) {
            return res.status(400).json({
              ok: false,
              message: "No se pudo cargar la imagen",
              errors: err
            });
          }
        });
      }

      medico.img = nombreArchivo;

      medico.save((err, medicoActualizado) => {
        return res.status(200).json({
          message: "Imagen actualizada",
          medico: medicoActualizado,
          ok: true
        });
      });
    });
  }
  if (tipo === "hospitales") {
    Hospital.findById(id, (err, hospital) => {
      if (!hospital) {
        return res.status(500).json({
          ok: false,
          message: "No existe hospital con id ingresado",
          errors: err
        });
      }

      var pathViejo = "./uploads/hospitales/" + hospital.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, err => {
          if (err) {
            return res.status(400).json({
              ok: false,
              message: "No se pudo cargar la imagen",
              errors: err
            });
          }
        });
      }

      hospital.img = nombreArchivo;

      hospital.save((err, hospitalActualizado) => {
        return res.status(200).json({
          message: "Imagen actualizada",
          hospital: hospitalActualizado,
          ok: true
        });
      });
    });
  }
}

module.exports = app;
