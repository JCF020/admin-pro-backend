const Usuario = require("../models/usuario");
const { response } = require("express");
const bcryptJS = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
  const usuario = await Usuario.find({}, "nombre email role google");

  res.json({ ok: true, usuario, uid: req.uid });
};

const crearUsuario = async (req, res = response) => {
  const { email, password, nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El Correo ya fue registrado",
      });
    }
    const usuario = new Usuario(req.body);

    const salt = bcryptJS.genSaltSync();
    usuario.password = bcryptJS.hashSync(password, salt);

    console.log(usuario);
    const usuarioCreado = await usuario.save();
    if (!usuarioCreado) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue creado",
      });
    }

    const token = await generarJWT(usuario.id);

    res.status(200).json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado, revisar el log",
    });
  }
};

const updateUsuarios = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDb = await Usuario.findById(uid);
    if (!usuarioDb) {
      return res.status(404).json({
        ok: false,
        msg: `El usuario no fue encontrado con este ID ` + uid,
      });
    }

    const { password, google, email, ...campos } = req.body;

    if (usuarioDb.email != email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "El correo ya existe",
        });
      }
    }
    campos.email = email;
    const usuaarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      usuario: usuaarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado actualizando el usuario",
    });
  }
};

const deleteUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDb = await Usuario.findById(uid);
    if (!usuarioDb) {
      return res.status(404).json({
        ok: false,
        msg: `El usuario no fue encontrado con este ID ` + uid,
      });
    }

    await Usuario.findOneAndDelete(uid);

    res.status(200).json({
      ok: true,
      msg: "Usuario Eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado eliminando el usuario",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  updateUsuarios,
  deleteUsuario,
};
