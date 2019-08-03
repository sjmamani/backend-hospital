var express = require("express");
var mdAuth = require("../middlewares/autenticacion");

var app = express();

var Hospital = require("../models/hospital");

/*
 * Obtener todos los hospitales
 */

app.get("/", (req, res, next) => {
  Hospital.find({})
    .populate("usuario", "nombre email")
    .exec((error, hospitales) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error en el servidor",
          ok: false,
          errors: error
        });
      }

      res.status(200).json({
        hospitales: hospitales,
        ok: true
      });
    });
});

/*
 * Crear un hospital
 */

app.post("/", mdAuth.verificarToken, (req, res) => {
  let hospital = new Hospital({
    nombre: req.body.nombre,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalCreado) => {
    if (err) {
      return res.status(400).json({
        message: "Error al crear el hospital",
        errors: err
      });
    }

    return res.status(201).json({
      hospital: hospitalCreado,
      message: "Hospital creado con éxito",
      usuariotoken: req.usuario // se define en el middleware de auth
    });
  });
});

/*
 * Actualizar un hospital
 */
app.put("/:id", mdAuth.verificarToken, (req, res) => {
  var id = req.params.id;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        message: `Error al buscar hospital con id ${id}`,
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        message: `No existe hospital con id ${id}`,
        errors: err
      });
    }

    hospital.nombre = req.body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalActualizado) => {
      if (err) {
        return res.status(400).json({
          message: `Error al actualizar hospital`,
          errors: err
        });
      }

      return res.status(200).json({
        message: `Hospital actualizado con éxito`,
        hospital: hospitalActualizado
      });
    });
  });
});

/*
 * Eliminar un hospital
 */
app.delete("/:id", mdAuth.verificarToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {
    if (err) {
      return res.status(500).json({
        message: `Error al eliminar hospital`,
        errors: err
      });
    }

    if (!hospitalEliminado) {
      return res.status(400).json({
        message: `No existe hospital con id ${id}`,
        errors: err
      });
    }

    return res.status(200).json({
      message: `Hospital eliminado con éxito`,
      hospital: hospitalEliminado
    });
  });
});

module.exports = app;
