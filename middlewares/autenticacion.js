var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

exports.verificarToken = function(req, res, next) {
  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        message: "Token inválido",
        errors: err
      });
    }

    req.usuario = decoded.usuario;

    next();
  });
};
