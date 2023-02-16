require('dotenv').config();
const express = require("express");
const app = express();

const clienteRoutes = require('./routes/index');

//middleware
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(function(req, res, next){
      /* Acceso a conexiones que requieran esta applicacion */
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "*");
      //res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
      res.header("Access-Control-Allow-Headers", "*");
      //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
});

//create use
app.use(clienteRoutes);

//fecha actual
var n = new Date();
var options2= {dataStyle: 'full'};
var l = n.toLocaleString("es-AR", options2)


//ROUTES//

app.listen(5000, ()=> {      
      console.log("Server corriendo en el puerto 5000 " + l)
});