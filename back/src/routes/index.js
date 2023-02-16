const { Router } = require('express');
const { getCliente,
      getClienteByEmail,
      //getClienteById, 
      createCliente, 
      createClienteGoogle,
      deleteCliente, 
      updateCliente,
      getProducto,      
      getProductoCliente,
      getProductoById,
      createProducto,
      updateProducto,
      deleteProducto, 
      getAlquiler,
      createAlquiler,
      getAlquilerCliente,
      getAlquilerProducto,
      deleteAlquiler,
      getCarrito,
      getCarritoById,      
      getAlquilerById,
      getReview,
      createReview,
      getMail,
      createEmail,
      getDevolucion,
      createDevolucion,
      pagar,      
      createPago,
      createExtensionAlquiler,
} = require('../controllers/index.controller')

const router = Router();

//TABLA-cliente
router.get('/cliente', getCliente)
router.get('/cliente/:email', getClienteByEmail)
//router.get('/cliente/:id_cliente', getClienteById)
router.post('/cliente', createCliente)
// router.delete('/cliente/:uid', deleteCliente)
router.post('/cliente_google', createClienteGoogle)
router.delete('/cliente/:uid/:email', deleteCliente)
router.put('/cliente/:id_cliente', updateCliente)

//TABLA-producto 
router.get('/producto', getProducto)
//router.get('/producto/:categoria', getProductoByCategoria)
router.get('/producto/productos_alquiler/:cliente', getProductoCliente)
router.get('/producto/:id_producto', getProductoById)
router.post('/producto', createProducto)
router.delete('/producto/:id_producto', deleteProducto)
router.put('/producto/:id_producto', updateProducto)

//TABLA-alquiler
router.get('/alquiler', getAlquiler)
router.post('/alquiler', createAlquiler)
router.get('/alquiler/productos_alquilados/:cliente', getAlquilerCliente)
router.get('/alquiler/alquileres-activos/:cliente', getAlquilerProducto)
router.get('/alquiler/:id_alquiler', getAlquilerById)
router.delete('/alquiler/:id_alquiler', deleteAlquiler)


//TABLA-carrito
router.get('/carrito', getCarrito)
router.get('/carrito/:id_alquiler', getCarritoById)

//TABLA-valoracion
//router.get('/review/:producto', getReview)
router.get('/review/:producto', getReview)
router.post('/review', createReview)
router.get('/mail', getMail)
router.post('/mail', createEmail)

//TABLA-devolución
router.get('/devolucion', getDevolucion)
router.post('/devolucion/:id_alquiler', createDevolucion)

//mercadopago
router.use('/pago', pagar)

//TABLA-pago postgresql
router.post('/pagoP', createPago)

//TABLA-extensión-alquiler
router.post('/extensionAlquiler', createExtensionAlquiler)


module.exports = router;