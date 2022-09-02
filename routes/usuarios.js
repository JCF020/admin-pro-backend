const { Router } = require("express");
const {
  getUsuarios,
  crearUsuario,
  updateUsuarios,
  deleteUsuario,
} = require("../controllers/usuarios");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getUsuarios);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuario
);

router.put(
  "/:id",
  [ 
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El el role es Obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateUsuarios
);

router.delete("/:id",validarJWT, deleteUsuario);

module.exports = router;
