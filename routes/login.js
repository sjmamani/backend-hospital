var express = require("express");
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();

// Google
const { OAuth2Client } = require("google-auth-library");
var CLIENT_ID = require("../config/config").CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

var Usuario = require("../models/usuario");

/* --------------------------
Autenticación de Google
--------------------------- */
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post("/google", async (req, res) => {
  var token = req.body.token;

  var googleUser = await verify(token).catch(err => {
    res.status(403).json({
      message: "Token no válido",
      errors: err,
      ok: false
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        message: "Error al buscar usuario",
        errors: err
      });
    }

    if (usuario) {
      if (usuario.google === false) {
        return res.status(400).json({
          message: "Debe de usar su autenticación normal",
          errors: err
        });
      } else {
        // generación de token
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: "1d" }); // weak secret

        return res.status(200).json({
          message: "Bienvenido",
          usuario: usuario,
          token: token
        });
      }
    } else {
      // El usuario no existe, hay que crearlo
      var usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioCreado) => {
        if (err) {
          return res.status(500).json({
            message: "Error al crear usuario",
            errors: err
          });
        }

        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: "1d" }); // weak secret

        return res.status(200).json({
          message: "Bienvenido",
          usuario: usuarioCreado,
          token: token
        });
      });
    }
  });
});

/* --------------------------
Autenticación normal
--------------------------- */
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
