var express = require("express");
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();

var Usuario = require("../models/usuario");

app.post("/", (req, res) => {
  Usuario.findOne({ email: req.body.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        message: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        message: `No se encontró usuario con mail ${req.body.email}`,
        errors: err
      });
    }

    if (!bcryptjs.compareSync(req.body.password, usuario.password)) {
      return res.status(400).json({
        message: "Credenciales incorrectas - password",
        errors: err
      });
    }

    // generación de token
    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: "1d" }); // weak secret

    return res.status(200).json({
      message: "Bienvenido",
      usuario: usuario,
      token: token
    });
  });
});

module.exports = app;
