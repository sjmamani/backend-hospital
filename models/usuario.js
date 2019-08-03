var mongoose = require("mongoose");
var mongooseUniqueValue = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{PATH} no es un rol válido" 
}

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, "El nombre es obligatorio"]},
    email: { type: String, unique: true, required: [true, "El email es obligatorio"]},
    password: { type: String, required: "La contraseña es obligatoria"},
    img: { type: String, required: false },
    role: { type: String, required: true, default: "USER_ROLE", enum: rolesValidos },
    google: { type: Boolean, default: false} 

});

usuarioSchema.plugin(mongooseUniqueValue, {message: "{PATH} debe ser único"});

module.exports = mongoose.model("Usuario", usuarioSchema);