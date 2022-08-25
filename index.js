const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./dataBase/config");

//Crear el servidor express
const app = express();

//Configurar Cors
app.use(cors());

//Base de datos
dbConnection();

//rutas
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Hola mundo" });
});

app.listen(process.env.PORT, () => {
  console.log(" Servidor corriendo en el puerto " + process.env.PORT);
});
