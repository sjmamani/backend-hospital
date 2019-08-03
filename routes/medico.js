var express = require("express");
var mdAuth = require("../middlewares/autenticacion");

var app = express();

var Medico = require("../models/medico");

/*
 * Obtener todos los medicos
 */

app.get("/", (req, res, next) => {
  Medico.find({})
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((error, medicos) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error en el servidor",
          ok: false,
          errors: error
        });
      }
      res.status(200).json({
        medicos: medicos,
        ok: true
      });
    });
});

/*
 * Crear un medico
 */

app.post("/", mdAuth.verificarToken, (req, res) => {
  let medico = new Medico({
    nombre: req.body.nombre,
    img: req.body.img,
    usuario: req.body.usuario,
    hospital: req.body.hospital
  });

  medico.save((err, medicoCreado) => {
    if (err) {
      return res.status(400).json({
        message: "Error al crear el medico",
        errors: err
      });
    }

    return res.status(201).json({
      medico: medicoCreado,
      message: "Médico creado con éxito",
      usuariotoken: req.usuario // se define en el middleware de auth
    });
  });
});

/*
 * Actualizar un medico
 */
app.put("/:id", mdAuth.verificarToken, (req, res) => {
  var id = req.params.id;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        message: `Error al buscar médico con id ${id}`,
        errors: err
      });
    }

    if (!medico) {
      return res.status(400).json({
        message: `No existe médico con id ${id}`,
        errors: err
      });
    }

    medico.nombre = req.body.nombre;
    medico.img = req.body.img;
    medico.usuario = req.body.usuario;
    medico.hospital = req.body.hospital;

    medico.save((err, medicoActualizado) => {
      if (err) {
        return res.status(400).json({
          message: `Error al actualizar médico`,
          errors: err
        });
      }

      return res.status(200).json({
        message: `Médico actualizado con éxito`,
        medico: medicoActualizado
      });
    });
  });
});

/*
 * Eliminar un medico
 */
app.delete("/:id", mdAuth.verificarToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndDelete(id, (err, medicoEliminado) => {
    if (err) {
      return res.status(500).json({
        message: `Error al eliminar médico`,
        errors: err
      });
    }

    if (!medicoEliminado) {
      return res.status(400).json({
        message: `No existe médico con id ${id}`,
        errors: err
      });
    }

    return res.status(200).json({
      message: `Médico eliminado con éxito`,
      medico: medicoEliminado
    });
  });
});

module.exports = app;
