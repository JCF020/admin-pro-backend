const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./dataBase/config");

//Crear el servidor express
const app = express();

//Configurar Cors
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//rutas
app.use("/api/usuario", require("./routes/usuarios"));
app.use("/api/login", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log(" Servidor corriendo en el puerto " + process.env.PORT);
});
