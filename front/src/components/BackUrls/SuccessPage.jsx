import React, { useState, useContext, useEffect, useCallback, useRef, useMemo } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import CartContext from '../../context/CartContext'
import success from '../../assets/success.png'
//user
import axios from 'axios';
import Swal from 'sweetalert2'

const SuccessPage = () => {

  //esta línea controla que no se haga el 2do render del useEffect
  //para no tener problemas con los inserts dobles a postgresql
  const effectRan = useRef(false)


  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const payment_id = params.get('payment_id')
  const payment_type = params.get('payment_type')

  //ALQUILER
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || [])
  const [cart, setCart] = useContext(CartContext)
  const [iniDate, setIniDate] = useState(JSON.parse(localStorage.getItem("fechaIni")) || [])
  const [finDate, setFinDate] = useState(JSON.parse(localStorage.getItem("fechaFin")) || [])
  const [totalPrice, setTotalPrice] = useState(JSON.parse(localStorage.getItem("total")) || [])

  //EXT ALQUILER 
  const [iniExtDate, setIniExtDate] = useState(JSON.parse(localStorage.getItem("fechaIniExt")) || [])
  const [finExtDate, setFinExtDate] = useState(JSON.parse(localStorage.getItem("fechaFinExt")) || [])
  const [alquiler, setAlquiler] = useState(JSON.parse(localStorage.getItem("alquiler")) || [])
  const [totalPriceExt, setTotalPriceExt] = useState(JSON.parse(localStorage.getItem("totalExt")) || [])


  // TODO: PRUEBA MÉTODO HANDLESUBMIT PARA UN EVENTO QUE ENVÍE A LA BD LOS DATOS DEL ALQUILER y el pago
  const fetchData = useCallback(async (e) => {
    const data = {
      fecha_inicio_alquiler: iniDate,
      fecha_fin_alquiler: finDate,
      total: totalPrice,
      producto: cart.id,
      cliente: user.email,
      propietario: cart[0].cliente,
      cantidad: cart.quantity,
      precio: cart.precio,
      cart: cart,
      id_mercadopago: payment_id,
      estado_pago: true,
      tipoPago: payment_type
    }
    try {
      await axios.post('http://localhost:5000/alquiler', data)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#6d4',
        icon: 'success',
        iconColor: '#fff',
        title: 'Alquiler realizado de manera correcta',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500
      })
      vaciarCart()
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al realizar el alquiler',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      //console.log(error.message)
    }
  }, [])


  // TODO: PRUEBA MÉTODO HANDLESUBMIT PARA UN EVENTO QUE ENVÍE A LA BD LOS DATOS DE LA EXTENSIÓN DEL ALQUILER y el pago
  const fetchExt = useCallback(async (e) => {
    const dataExt = {
      alquiler: alquiler,
      fecha_inicio_extension: iniExtDate,
      fecha_fin_extension: finExtDate,
      totalExt: totalPriceExt,
      id_mercadopago: payment_id,
      estado_pago: true,
      tipoPago: payment_type
    }
    try {
      await axios.post('http://localhost:5000/extensionAlquiler', dataExt)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#6d4',
        icon: 'success',
        iconColor: '#fff',
        title: 'Extensión de alquiler realizada de manera correcta',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500
      })
      vaciarCart()
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al realizar el alquiler',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      //console.log(error.message)
    }
  }, [])


  useEffect(() => {
    if (effectRan.current === false) {
      if (cart.length > 0) {
        fetchData()
      } else {
        fetchExt()
      }
      return () => {        
        effectRan.current = true
      }
    }
  }, [])

  const vaciarCart = () => {
    setCart([])
    localStorage.clear()
  }

  return (
    <div className='py-5'>
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }} className='text-center text-white'>
            <img style={{ width: '70%' }} src={success} alt="fail" />
            <h2 className='py-3'>Felicitaciones, pago correcto</h2>
            <Link to="/" className='cart-link'>Seguir Alquilando</Link>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SuccessPage