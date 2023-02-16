import React, { useState, useContext } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import CartContext from '../../context/CartContext'
import imgCart from '../../../src/assets/cart.svg'

import './Cart.css';

//datepicker 
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";

//user
import { UserAuth } from '../../context/userContext'
import axios from 'axios';

//sweetalert
import Swal from 'sweetalert2'
import CartItem from './CartItem';

registerLocale('es', es)


const Cart = () => {

  const { user } = UserAuth();

  const [iniDate, setIniDate] = useState(new Date().toLocaleString('es-AR')) //fecha inicio alquiler
  const [finDate, setFinDate] = useState(new Date().toLocaleString('es-AR')) //fecha final alquiler
  // const [realDate, setRealDate] = useState() fecha final alquiler

  localStorage.setItem('fechaIni', JSON.stringify(iniDate))
  localStorage.setItem('fechaFin', JSON.stringify(finDate))
  localStorage.setItem('user', JSON.stringify(user))

  // let fechaInicial = moment(iniDate)
  // let fechaFinal = moment(finDate)
  // const diasTranscurridos = fechaFinal.diff(fechaInicial, 'days')  

  let ini = new Date(iniDate.toString())
  let fin = new Date(finDate.toString())

  let milisegundosDia = 24 * 60 * 60 * 1000;
  let milisegundosTranscurridos = Math.abs(ini.getTime() - fin.getTime());
  let diasTranscurridos = Math.abs(milisegundosTranscurridos/milisegundosDia);  

  const [cart, setCart] = useContext(CartContext)


  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const totalPrice = cart.reduce((acc, curr) => {
    return acc + curr.quantity * curr.precio
  }, 0)

  localStorage.setItem('total', JSON.stringify(totalPrice * Number(diasTranscurridos)))

  //TODO: ELIMINAR DEL CARRITO Y DEL LOCAL STORAGE
  // const eliminarProducto = (id) => {
  //   const prodEliminar = cart.filter((producto) => producto.id !== id)
  //   setCart(prodEliminar)
  // }

  //TODO: vaciar carrito
  const vaciarCart = () => {
    setCart([]);
  }

  const handlePagar = async (e) => {
    e.preventDefault();
    let cartProd = []
    cart.forEach(prod => {
      cartProd.push({
        'title': prod.nombre,
        'currency_id': 'ARS',
        'picture_url': prod.urlfoto,
        'description': prod.description,
        'unit_price': prod.precio * Number(diasTranscurridos),
        'quantity': prod.quantity
      })
    })    
    await axios.post('http://localhost:5000/pago', cartProd).then((res) => (window.location.href = res.data.response.body.init_point))
  }
  
  if (cart.length === 0) {
    return (
      <Container className='py-5'>
        <Row className="mt-5">
          <Col md={{ span: 6, offset: 3 }} className='text-center text-white'>
            <img style={{ width: '70%' }} src={imgCart} alt="error-404" />
            <h2 className='py-3'>No hay productos en el carrito</h2>
            <p>Vuelve al <Link to="/">Inicio</Link></p>
          </Col>
        </Row>
      </Container>
    )
  } else {
    return (
      <div className='py-5'>
        <table>
          <caption className='cart-caption'><strong>Mi carrito</strong> | Te estás llevando <strong>{quantity} Productos</strong></caption>
        </table>
        <Container>
          <Row className='d-flex justify-content-between'>
            <Col xs={12} lg={2}>
              <div className="cart-i d-flex aling-items-center">
                <Link to={'/'} style={{ textDecoration: "none" }}>
                  <span><i className="fa-solid fa-left-long cart-a"></i></span>
                </Link>
              </div>
            </Col>
            <Col xs={12} lg={2}>
              <a className='cart-a' onClick={() => vaciarCart()}> Vaciar carrito <i className="fa-solid   fa-cart-arrow-down"></i></a>
            </Col>
          </Row>
        </Container>
        <Container className='py-1'>
          <Row className='d-flex justify-content-between'>
            <Col xs={12} lg={8}>
              <Container>
                {cart.map((producto, index) => {
                  return (
                    <CartItem
                      key={producto.id}
                      id={producto.id}
                      urlfoto={producto.urlfoto}
                      nombre={producto.nombre_producto}
                      precio={producto.precio}
                      quantity={producto.quantity}
                      categoria={producto.categoria}
                      descripcion={producto.descripcion}
                      cantidad={producto.cantidad}
                      cliente={producto.cliente}
                    />
                  )                  
                })}
              </Container>
            </Col>
            <Col xs={12} lg={4}>
              <div className='container-price'>
                <div>
                  <Container className='container-price-item'>
                    <Row>
                      <Col className='d-flex align-items-start justify-content-start'>
                        Total:
                      </Col>
                      <Col className='d-flex align-items-start justify-content-end'>
                      { diasTranscurridos > 0 
                        ?<strong>${totalPrice * Number(diasTranscurridos)}</strong>
                        :<strong>${totalPrice}</strong>
                      }                        
                      </Col>
                    </Row>
                  </Container>
                </div>
                <form onSubmit={handlePagar}>
                  <div className='pb-3'>
                    <Container>
                      <Row className='d-flex align-items-center justify-content-center'>
                        <Col xs={12} lg={10}>
                          <p className='p-fecha text-center'>Fecha inicio alquiler</p>
                          <div className='d-flex align-items-center justify-content-center'>
                            <input type="date" selected={iniDate} onChange={((e) => setIniDate(e.target.value))} min={iniDate} required/>
                          </div>
                          {/** <DatePicker selected={iniDate} onChange={(date) => setIniDate(date)} locale="es" dateFormat="yyyy-MM-dd" minDate={iniDate} />*/}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <div className='pb-5'>
                    <Container>
                      <Row className='d-flex align-items-center justify-content-center'>
                        <Col xs={12} lg={10}>
                          <p className='p-fecha text-center'>Fecha fin alquiler</p>
                          <div className='d-flex align-items-center justify-content-center'>
                            <input type="date" selected={finDate} onChange={((e) => setFinDate(e.target.value))} min={iniDate} required/>
                          </div>
                          {/** <DatePicker selected={finDate} onChange={(date) => setFinDate(date)} locale="es" dateFormat="yyyy-MM-dd" minDate={iniDate} />*/}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <div className='py-2'>
                    <Container>
                      <Row>
                        <Col>
                          <button className='cart-button mx-auto mb-2 d-block btn btn-success'  type="submit">Pagar </button>
                          {/**  <button className='cart-button mx-auto mb-2 d-block' onClick={handleClick}>Alquilar <i className="fa-solid fa-truck-ramp-box"></i></button>*/}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </form>
                <div className='py-2'>
                  <Container>
                    <Row>
                      <Col className='text-center container-advice'>
                        <p>IMPORTANTE</p>
                        <p>Recordá que el <strong>Producto</strong></p>
                        <p>sólo puede ser retirado por el</p>
                        <p><strong>titular de la tarjeta</strong></p>
                        <p>con la que se efectuó el alquiler acompañado con su</p>
                        <p><strong>DNI</strong></p>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Cart