var express = require("express");
var bcryptjs = require("bcryptjs");
var mdAuth = require("../middlewares/autenticacion");

var app = express();

var Usuario = require("../models/usuario");

/*
 * Obtener todos los usuarios
 */

app.get("/", (req, res, next) => {
  Usuario.find({}, "nombre email img role").exec((error, usuarios) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error en el servidor",
        ok: false,
        errors: error
      });
    }

    res.status(200).json({
      usuarios: usuarios,
      ok: true
    });
  });
});

/*
 * Crear un usuario
 */

app.post("/", mdAuth.verificarToken, (req, res) => {
  let usuario = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password, 10),
    img: req.body.img,
    role: req.body.role
  });

  usuario.save((err, usuarioCreado) => {
    if (err) {
      return res.status(400).json({
        message: "Error al crear el usuario",
        errors: err
      });
    }

    return res.status(201).json({
      usuario: usuarioCreado,
      message: "Usuario creado con éxito",
      usuariotoken: req.usuario // se define en el middleware de auth
    });
  });
});

/*
 * Actualizar un usuario
 */
app.put("/:id", mdAuth.verificarToken, (req, res) => {
  var id = req.params.id;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        message: `Error al buscar usuario con id ${id}`,
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        message: `No existe usuario con id ${id}`,
        errors: err
      });
    }

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.role = req.body.role;

    usuario.save((err, usuarioActualizado) => {
      if (err) {
        return res.status(400).json({
          message: `Error al actualizar usuario`,
          errors: err
        });
      }

      usuarioActualizado.password = null;

      return res.status(200).json({
        message: `Usuario actualizado con éxito`,
        usuario: usuarioActualizado
      });
    });
  });
});

/*
 * Eliminar un usuario
 */
app.delete("/:id", mdAuth.verificarToken, (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
    if (err) {
      return res.status(500).json({
        message: `Error al eliminar usuario`,
        errors: err
      });
    }

    if (!usuarioEliminado) {
      return res.status(400).json({
        message: `No existe usuario con id ${id}`,
        errors: err
      });
    }

    return res.status(200).json({
      message: `Usuario eliminado con éxito`,
      usuario: usuarioEliminado
    });
  });
});

module.exports = app;
