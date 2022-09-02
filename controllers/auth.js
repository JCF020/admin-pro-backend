const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptJS = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
    const {email, password} = req.body;


    try {

        const usuarioDb = await Usuario.findOne({email});

        if(!usuarioDb){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        const validPassword = bcryptJS.compareSync(password, usuarioDb.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }

        const token = await generarJWT(usuarioDb.id)

        res.status(200).json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
};

module.exports = {
  login,
};
