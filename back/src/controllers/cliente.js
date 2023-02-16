const { Pool } = require("pg");
const nodemailer = require("nodemailer");
const mercadopago = require("mercadopago");
const cron = require('node-cron')

const pool = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  database: "rentalstore",
  port: 5432,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0
})

var admin = require("firebase-admin");
var serviceAccount = require("../rentalstoreSDK.json");
const { app } = require("firebase-admin");

administrador = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//MERCADOPAGO (CHECKOUT PRO)
mercadopago.configure({
  access_token: "APP_USR-6472177112345232-012812-c8d4ca61c36d08f07e4bc529cd571c66-1297306104"
});

const pagar = (req, res) => {
  /** Traigo la orden del front, con los productos del carrito*/
  const cartProd = req.body
  //console.log(cartProd)  
  let preference = {
    items: cartProd,
    back_urls: {
      "success": "http://localhost:3000/success",
      "failure": "http://localhost:3000/failure"
    },
    auto_return: "all",
    binary_mode: true,
    marketplace: "RENTAL STORE"
  }

  /**MP crea una "preferencia" en donde se asume que la "orden" tiene los datos del producto*/
  mercadopago.preferences.create(preference)
    .then((response) => res.status(200).send({ response }))
    .catch((error) => {
      res.status(500).json({ global: error })
    })
}

/**Función para obtener la fecha actual, la cual utilizaremos luego para enviar el correo de vencimiento de alquiler*/
const fecha_hoy = () => {
  let fs = new Date();
  let ds = fs.getDate();
  let ms = fs.getMonth() + 1;
  let ys = fs.getFullYear();
  let fecha_hoy = ds + "/" + ms + "/" + ys;
  return fecha_hoy;
}

/**Función que envía un email al usuario, cuando la fecha de vencimiento del alquiler sea igual al día actual */
const alquiler_vence = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT id_alquiler, fecha_inicio_alquiler, fecha_fin_alquiler, total, cliente, propietario FROM alquiler');
    response.rows.forEach(element => {
      console.log(element.fecha_fin_alquiler.toLocaleDateString('es-AR'))
      if (element.fecha_fin_alquiler.toLocaleDateString() == null) {
        let mu = 1
      } else {
        if (element.fecha_fin_alquiler.toLocaleDateString('es-AR') == fecha_hoy()) {
          //PARA PROBAR PONER !== EN EL CONDICIONAL ASÍ ENVÍA EL CORREO
          mail_unico_aviso(element.cliente)
        }
      }
    })
    console.log('Cron lanzado')
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const mail_unico_aviso = async (email) => {
  try {
    let mailOptions = {
      from: myemail,
      to: email,
      subject: 'Rental store aviso de alquiler',
      text: 'Único aviso',
      html:
        `
        <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'
    integrity='sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk' crossorigin='anonymous'>
<div class='container'>
    <div class='row' style='margin-top: 1rem; text-align: center;'>
        <div class='col'>
            <h1 class='display-4'>NO SPAM</h1>
            <hr style='margin-left: 5rem; margin-right: 5rem;'>
        </div>
    </div>
    <div class='row' style='margin-top: 1rem; text-align: center; background-color: rgb(117, 20, 220);'>
        <div class='col'>
            <h5 style='color: white;'>Rental Store Avisos</h5>
        </div>
    </div>
    <div class='row' style='text-align: center; margin-top: 7rem;'>
        <div class='col'>
            <p><strong>Tu alquiler vence hoy!!</strong> Devuelve los productos en tiempo y forma para seguir contando
                con los beneficios de alquilar.</p>
            <h1 style='margin-bottom: 5rem;'>No dejes pasar este aviso</h1>
        </div>
    </div>
    <div class='row' style='text-align: center;'>
        <div class='col'>
            <img style='max-width: 20rem; margin-bottom: 2rem;'
                src='https://firebasestorage.googleapis.com/v0/b/rental-store-dbd1b.appspot.com/o/logoRental.png?alt=media&token=6bb33804-32a9-421f-8d97-ba639bfaf231'
                alt=''>
        </div>
    </div>
</div>
</div>
    `
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myemail,
        pass: mypassword
      },
      tls: {
        rejectUnauthorized: false,
      }
    });


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log('Email enviado: ' + element.email)
    })


  } catch (error) {
    console.error(error.message);
  }

  //0 59 23 1/1 * ? * (se ejecuta todos los días a las 12 para avisar a los clientes que se les vence en el día)
  // * * * * * (cada 1 minuto)
}
/**Programador de tareas, en este caso se envía a las 12 del día que debe devolver el alquiler*/
cron.schedule('0 59 23 1/1 * *', () => {
  alquiler_vence()
});


//EMAIL (De propietario a cliente)
let myemail = 'rentalstoreapp@gmail.com';
let mypassword = 'sgmzeqvapfzggvvn';

const enviarEmail = ({ email, asunto, mensaje }) => {
  console.log(email)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: myemail,
      pass: mypassword
    }
  });

  const mail_config = {
    from: myemail,
    to: email,
    subject: asunto,
    text: mensaje,
  }

  transporter.sendMail(mail_config, function (err, info) {
    if (err) {
      console.log(err)
      console.log("error en el envío" + err.message)
    } else {
      console.log('email enviado de manera correcta')
    }
  })
}

const getMail = async (req, res) => {
  try {
    enviarEmail()
    res.json({ msg: "server" });
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
}

const createEmail = async (req, res) => {
  try {
    enviarEmail(req.body)
    res.json({ msg: "server" });
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
}


//TABLA-CLIENTES
const getCliente = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM cliente');
    console.log(response.rows);
    res.status(200).json(response.rows);
    console.log("GET de cliente exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getClienteByEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const response = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
    if (response.rows.length === 0)
      return res.status(400).json({
        message: "No hay clientes con ese email aún"
      });
    res.status(200).json(response.rows[0]);
    console.log(response)
    console.log("GETCLIENTEBYEMAIL de cliente exitoso");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

//crea el cliente en firebase y lo añade a postgresql 
const createCliente = async (req, res, next) => {
  try {
    const { uid, nombre, apellido, direccion, telefono, email, password, rol } = req.body;
    const response = await pool.query('INSERT INTO cliente (uuid, nombre, apellido, direccion, telefono, email, password, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_cliente', [
      uid,
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      password,
      rol
    ]);
    res.status(200).json(response.rows);
    console.log(response.rows);
    console.log("INSERT de cliente en postgresql exitoso");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

//averiguar si existe una mejor manera de hacer auth con google
const createClienteGoogle = async (req, res, next) => {
  try {
    const { uid, email, rol } = req.body;
    const response = await pool.query('INSERT INTO cliente (uuid, nombre, apellido, direccion, telefono, email, password, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_cliente', [
      uid,
      null,
      null,
      null,
      null,
      email,
      null,
      rol
    ]);
    res.status(200).json(response.rows);
    console.log(response.rows);
    console.log("INSERT cliente en postgresql exitoso con GOOGLE");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const updateCliente = async (req, res, next) => {
  try {
    const id_cliente = req.params.id_cliente;
    const { nombre, apellido, direccion, telefono, email, password, rol } = req.body;
    const response = await pool.query('UPDATE cliente SET nombre = $1, apellido = $2, direccion =$3, telefono=$4, email=$5, password=$6, rol=$7 WHERE id_cliente=$8', [
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      password,
      rol,
      id_cliente,
    ]);
    res.status(200).json(response.rows);
    console.log('CLIENTE actualizado de manera correcta');
  } catch (error) {
    console.log(error.message)
    next(error);
  }
}


const deleteCliente = (req, res, next) => {
  const email = req.params.email;
  pool.query('DELETE FROM cliente WHERE email = $1', [email])
  .then((response) =>{
    const uid = req.params.uid;
    const responseFire = administrador.auth().deleteUser(uid)
    res.sendStatus(200);
    console.log('CLIENTE eliminado de manera correcta de FIREBASE y Postgresql');
  })
  .catch((error) =>{
    if(error.code == 23503){
      res.send({msg: "No se puede eliminar alquiler/s activo/s"})
    }else{
      res.send({msg: "otro error"})
    }
  })    
}


//TABLA-PRODUCTOS
const getProducto = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM producto');
    res.status(200).json(response.rows);
    console.log("GET de producto exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getProductoByCategoria = async (req, res, next) => {
  try {
    const categoria = req.params.categoria
    if (categoria) {
      const response = await pool.query('SELECT * FROM producto where categoria = $1', [categoria]);
      res.status(200).json(response.rows)
      console.log("GET de productos por categoría exitoso")
    } else {
      const response = await pool.query('SELECT * FROM producto');
      res.status(200).json(response.rows);
      console.log("GET de producto exitoso");
    }
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const getProductoCliente = async (req, res, next) => {
  try {
    const cliente = req.params.cliente;
    console.log(cliente)
    const response = await pool.query('SELECT * FROM producto WHERE cliente = $1 ORDER BY id_producto ASC', [cliente]);
    res.status(200).json(response.rows);
    console.log("GET de producto-cliente exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getProductoById = async (req, res, next) => {
  try {
    const id_producto = req.params.id_producto;
    const response = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [id_producto]);
    res.status(200).json(response.rows);
    console.log("GET de producto por ID exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const createProducto = async (req, res, next) => {
  try {
    const { nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, valoracion, categoria, cliente } = req.body;
    const response = await pool.query('INSERT INTO producto (nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, valoracion, categoria, cliente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_producto', [
      nombre_producto,
      precio,
      descripcion_producto,
      cantidad,
      estado,
      urlfoto,
      valoracion,
      categoria,
      cliente
    ]);
    res.status(200).json(response.rows);
    console.log("Producto insertado en postgresql");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const updateProducto = async (req, res, next) => {
  try {
    const id_producto = req.params.id_producto;
    const { nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, valoracion, categoria, cliente } = req.body;
    const response = await pool.query('UPDATE producto SET nombre_producto = $1, precio = $2, descripcion_producto =$3, cantidad=$4, estado=$5, urlfoto=$6, valoracion=$7, categoria=$8, cliente=$9 WHERE id_producto=$10', [
      nombre_producto,
      precio,
      descripcion_producto,
      cantidad,
      estado,
      urlfoto,
      valoracion,
      categoria,
      cliente,
      id_producto,
    ]);
    res.status(200).json(response.rows);
    console.log("UPDATE de producto exitoso")
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const deleteProducto = async (req, res, next) => {
  try {
    const id_producto = req.params.id_producto;
    const response = await pool.query('DELETE FROM producto WHERE id_producto = $1', [id_producto]);
    res.status(200).json(response.rows);
    console.log("Producto ELIMINADO de manera correcta")
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

//TABLA-ALQUILER
const getAlquiler = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM alquiler');
    res.status(200).json(response.rows);
    console.log("GET de Alquiler exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getAlquilerCliente = async (req, res, next) => {
  try {
    const cliente = req.params.cliente;
    console.log(cliente)
    const response = await pool.query('SELECT * FROM alquiler WHERE cliente = $1 ORDER BY id_alquiler ASC', [cliente]);
    res.status(200).json(response.rows);
    console.log("SELECT de Alquiler-Cliente exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getAlquilerProducto = async (req, res, next) => {
  try {
    //el cliente en este caso sería el propietario de lo productos
    const cliente = req.params.cliente;
    console.log(cliente)
    const response = await pool.query(
      'select alquiler.id_alquiler, alquiler.fecha_inicio_alquiler as fecha_ini, alquiler.fecha_fin_alquiler as fecha_fin, cliente.email, cliente.telefono, cliente.direccion, pago.estado_pago from alquiler inner join carrito on carrito.alquiler = alquiler.id_alquiler inner join producto on carrito.producto = producto.id_producto inner join cliente on cliente.email = alquiler.cliente inner join pago on pago.alquiler = alquiler.id_alquiler where alquiler.propietario = $1 Group by alquiler.id_alquiler, fecha_ini, fecha_fin, cliente.email, cliente.telefono, cliente.direccion, pago.estado_pago', [cliente]);
    res.status(200).json(response.rows);
    console.log("SELECT de Alquiler-Propietario-Producto-Cliente exitoso");
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

const getAlquilerById = async (req, res, next) => {
  try {
    const id_alquiler = req.params.id_alquiler;
    const response = await pool.query('SELECT * FROM alquiler WHERE id_alquiler = $1', [id_alquiler]);
    res.status(200).json(response.rows);
    console.log("GET de Alquiler por ID exitoso");
    console.log(response);
  } catch (error) {
    console.log(error.message)
    next(error);
  }
}

//Controlar la sentencia para ver si se inserta siempre o sólo cuando cumple las condiciones
const createAlquiler = async (req, res, next) => {
  try {
    const {
      fecha_inicio_alquiler,
      fecha_fin_alquiler,
      total,
      cliente,
      propietario,
      producto,
      cantidad,
      precio,
      cart,
      id_mercadopago,
      estado_pago,
      tipoPago
    } = req.body;

    const response = await pool.query('INSERT INTO alquiler (fecha_inicio_alquiler, fecha_fin_alquiler,total,cliente, propietario) VALUES ($1, $2, $3, $4, $5) RETURNING id_alquiler', [
      fecha_inicio_alquiler,
      fecha_fin_alquiler,
      total,
      cliente,
      propietario
    ])
    res.status(200).json(response.rows);
    for (var i = 0; i < cart.length; i++) {
      pool.query('INSERT INTO carrito (alquiler, producto, cantidad, precio) VALUES ($1, $2, $3, $4) RETURNING id_carrito',
        [
          response.rows[0].id_alquiler,
          cart[i].id,
          cart[i].quantity,
          cart[i].precio
        ])
    }
    pool.query('INSERT INTO pago (id_mercadopago, estado_pago, tipoPago, alquiler) VALUES ($1, $2, $3, $4) RETURNING id_pago',
      [
        id_mercadopago,
        estado_pago,
        tipoPago,
        response.rows[0].id_alquiler
      ])
    console.log("Alquiler Insertado en postgresql");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const deleteAlquiler = async (req, res, next) => {
  try {
    const id_alquiler = req.params.id_alquiler;
    const response = await pool.query('DELETE FROM alquiler WHERE id_alquiler = $1', [id_alquiler]);
    res.status(200).json(response.rows);
    console.log("Alquiler elimnado de postgresql");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}


//TABLA-CARRITO
const getCarrito = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM carrito');
    res.status(200).json(response.rows);
    console.log("GET de Carrito exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getCarritoById = async (req, res, next) => {
  try {
    const alquiler = req.params.id_alquiler;
    const response = await pool.query(
      'SELECT A.id_alquiler, CP.id_carrito, CP.cantidad, CP.precio, PR.id_producto, PR.nombre_producto, PR.precio, PR.urlfoto, PR.cliente, C.telefono FROM alquiler A, carrito CP, producto PR, cliente C WHERE CP.alquiler = $1 AND CP.alquiler = A.id_alquiler AND CP.producto = PR.id_producto AND PR.cliente = C.email', [alquiler]);
    res.status(200).json(response.rows);
    console.log("GET de Carrito por ID exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const createCarrito = async (req, res, next) => {
  try {
    const { alquiler, producto, cantidad, precio } = req.body;
    const response = await pool.query('INSERT INTO carrito (alquiler, producto, cantidad, precio) VALUES ($1,$2,$3,$4) RETURNING id_carrito', [
      alquiler,
      producto,
      cantidad,
      precio
    ]);
    res.status(200).json(response.rows);
    console.log("Carrito insertado en postgresql")
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const updateCarrito = async (req, res, next) => {
  try {
    const id_carrito = req.params.id_carrito;
    const { alquiler, producto, cantidad, precio } = req.body;
    const response = await pool.query('UPDATE carrito SET alquiler=$1, producto=$2, cantidad=$3, precio=$4 WHERE id_carrito=$5', [
      alquiler,
      producto,
      cantidad,
      precio
    ]);
    res.status(200).json(response.rows);
    console.log('UPDATE de carrito exitoso')
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const deleteCarrito = async (req, res, next) => {
  try {
    const id_carrito = req.params.id_carrito;
    const response = await pool.query('DELETE FROM carrito WHERE id_carrito = $1', [id_carrito]);
    res.status(200).json(response.rows);
    console.log("Carrito ELIMINADO de manera correcta")
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}
//TABLA-VALORACIÓN
const getReview = async (req, res, next) => {
  try {
    const { producto } = req.params;
    const response = await pool.query('SELECT * FROM valoracion WHERE producto = $1', [producto]);
    res.status(200).json(response.rows);
    console.log("GET de Valoración exitoso");
  } catch (error) {
    console.log(error.message)
    next(error);
  }
}

const getReviewById = async (req, res, next) => {
  try {
    const id_valoracion = req.params.id_valoracion;
    const response = await pool.query('SELECT * FROM valoracion WHERE id_valoracion = $1', [id_valoracion]);
    res.status(200).json(response.rows);
    console.log('GET de valoración por ID exitoso')
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const getReviewE = async (req, res, next) => {
  try {
    const { producto } = req.params;
    const response = await pool.query('SELECT * FROM valoracion WHERE producto = $1 ', [producto]);
    res.status(200).json(response.rows[0]);
    console.log("GET de Valoración exitoso");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const createReview = async (req, res, next) => {
  try {
    const { valoracion, fecha, comentario, cliente, producto } = req.body;
    const response = await pool.query('INSERT INTO valoracion (valoracion, fecha, comentario,cliente,producto) VALUES ($1, $2, $3, $4, $5) RETURNING id_valoracion', [
      valoracion,
      fecha,
      comentario,
      cliente,
      producto
    ])
    res.status(200).json(response.rows);
    console.log("Valoración Insertada en postgresql");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const updateReview = async (req, res, next) => {
  try {
    const id_valoracion = req.params.id_valoracion
    const { valoracion, fecha, comentario, cliente, producto } = req.body;
    const response = await pool.query('UPDATE valoracion SET valoracion = $1, fecha = $2, comentario =$3, cliente=$4, producto=$5 WHERE id_valoracion=$6', [
      valoracion,
      fecha,
      comentario,
      cliente,
      producto
    ]);
    res.status(200).json(response.rows);
    console.log("UPDATE de valoración exitosa")
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

const deleteReview = async (req, res, next) => {
  try {
    const id_valoracion = req.params.id_valoracion;
    const response = await pool.query('DELETE FROM valoracion WHERE id_valoracion = $1', [id_valoracion]);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

//TABLA-PAGO
const createPago = async (req, res) => {
  try {
    const { id_mercadopago, estado_pago, tipoPago, alquiler } = req.body;
    const response = await pool.query('INSERT INTO pago (id_mercadopago, estado_pago,tipoPago,alquiler) VALUES ($1, $2, $3, $4) RETURNING id_pago', [
      id_mercadopago,
      estado_pago,
      tipoPago,
      alquiler,
    ])
    res.status(200).json(response.rows);
    console.log("Pago Insertado en postgresql");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

//TABLA-EXTENSIÓN-ALQUILER
const getExtensionAlquiler = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM extensionAlquiler');
    res.status(200).json(response.rows);
    console.log("GET de extensión alquiler exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const getExtensionAlquilerById = async (req, res, next) => {
  try {
    const id_extension = req.params.id_extension
    const response = await pool.query('SELECT * FROM extensionAlquiler WHERE id_extension =$1', [id_extension]);
    res.status(200).json(response.rows);
    console.log("GET de extensión alquiler por ID exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const createExtensionAlquiler = async (req, res, next) => {
  try {
    const { alquiler, fecha_inicio_extension, fecha_fin_extension, totalExt, id_mercadopago, estado_pago, tipoPago } = req.body;
    const response = await pool.query('INSERT INTO extensionAlquiler (alquiler, fecha_inicio_extension, fecha_fin_extension, totalExt) VALUES ($1, $2, $3, $4) RETURNING id_extension', [
      alquiler,
      fecha_inicio_extension,
      fecha_fin_extension,
      totalExt
    ])
    pool.query('INSERT INTO pago (id_mercadopago, estado_pago, tipoPago, alquiler) VALUES ($1, $2, $3, $4) RETURNING id_pago',
      [
        id_mercadopago,
        estado_pago,
        tipoPago,
        alquiler
      ])
    res.status(200).json(response.rows);
    console.log("Extensión alquiler insertada en postgresql");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

//TABLA-DEVOLUCIÓN
const getDevolucion = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM devolucion');
    res.status(200).json(response.rows);
    console.log("GET de Devolución exitoso");
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const createDevolucion = async (req, res) => {
  try {
    const id_alquiler = req.params.id_alquiler;
    const response = await pool.query('INSERT INTO devolucion (alquiler) VALUES ($1) RETURNING id_devolucion', [
      id_alquiler
    ]);
    res.status(200).json(response.rows);
    console.log("Devolución creada en postgresql");
  } catch (error) {
    console.error(error.message)
    next(error);
  }
}

module.exports = {
  //TABLA-CLIENTE
  getCliente,
  getClienteByEmail,
  //getClienteById,
  createCliente,
  createClienteGoogle,
  deleteCliente,
  updateCliente,

  //TABLA-PRODUCTO
  getProducto,
  getProductoCliente,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,

  //TABLA-ALQUILER
  getAlquiler,
  createAlquiler,
  getAlquilerCliente,
  getAlquilerProducto,
  getAlquilerById,
  deleteAlquiler,

  //TABLA-CARRITO
  getCarrito,
  getCarritoById,

  //TABLA-VALORACION
  getReview,
  createReview,

  //MAIL
  getMail,
  createEmail,

  //TABLA-DEVOLUCIÓN
  getDevolucion,
  createDevolucion,

  //MERCADOPAGO
  pagar,

  //TABLA-PAGO
  createPago,

  //TABLA-EXTENSIÓN-ALQUILER
  createExtensionAlquiler
}