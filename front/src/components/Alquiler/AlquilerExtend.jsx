import React, { useState, useContext, useEffect, useRef, Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import CartContext from '../../context/CartContext'
import imgCart from '../../../src/assets/cart.svg'
import moment from 'moment';

import { useParams } from 'react-router-dom'


//datepicker 
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";

//user
import { UserAuth } from '../../context/userContext'
import axios from 'axios';

//sweetalert
import Swal from 'sweetalert2'

registerLocale('es', es)

const AlquilerExtend = () => {

  //esta línea controla que no se haga el 2do render del useEffect
  //para no tener problemas con los inserts dobles a postgresql
  const effectRan = useRef(false)

  const { id_alquiler } = useParams();

  const [iniExtDate, setIniExtDate] = useState(new Date().toLocaleString('es-AR')) //fecha inicio alquiler
  const [finExtDate, setFinExtDate] = useState(new Date().toLocaleString('es-AR')) //fecha final alquiler

  localStorage.setItem('fechaIniExt', JSON.stringify(iniExtDate))
  localStorage.setItem('fechaFinExt', JSON.stringify(finExtDate))
  localStorage.setItem('alquiler', JSON.stringify(id_alquiler))

  const [alquiler, setAlquiler] = useState([]);
  const [carrito, setCarrito] = useState([])

  let ini = new Date(iniExtDate.toString())
  let fin = new Date(finExtDate.toString())

  let milisegundosDia = 24 * 60 * 60 * 1000;
  let milisegundosTranscurridos = Math.abs(ini.getTime() - fin.getTime());
  let diasTranscurridos = Math.abs(milisegundosTranscurridos / milisegundosDia);
  

  // let fechaInicial = moment(iniExtDate)
  // let fechaFinal = moment(finExtDate)
  // const diasTranscurridos = fechaFinal.diff(fechaInicial, 'days')

  const cantidad = carrito.reduce((acc, curr) => {
    return acc + carrito.cantidad;
  }, 0);

  const totalPriceExt = carrito.reduce((acc, curr) => {
    return acc + curr.cantidad * curr.precio
  }, 0)

  localStorage.setItem('totalExt', JSON.stringify(totalPriceExt * Number(diasTranscurridos)))

  useEffect(() => {
    if (effectRan.current === false) {
      getAlquiler(id_alquiler)
      getCarrito(id_alquiler)
      return () => {        
        effectRan.current = true
      }
    }
  }, [])

  const getAlquiler = async (id_alquiler) => {
    const response = await axios.get(`http://localhost:5000/alquiler/${id_alquiler}`)
    if (response.status === 200) {
      setAlquiler(response.data)      
    }
  }

  const getCarrito = async (id_alquiler) => {
    const response = await axios.get(`http://localhost:5000/carrito/${id_alquiler}`)
    if (response.status === 200) {
      setCarrito(response.data)      
    }
  }


  const handlePagar = async (e) => {
    e.preventDefault();
    let carritoProd = []
    carrito.forEach(prod => {
      carritoProd.push({
        'title': prod.nombre_producto,
        'currency_id': 'ARS',
        'picture_url': prod.urlfoto,
        'unit_price': prod.precio * Number(diasTranscurridos),
        'quantity': prod.cantidad
      })
    })    
    await axios.post('http://localhost:5000/pago', carritoProd).then((res) => (window.location.href = res.data.response.body.init_point))
  }

  return (
    <div className='py-5'>
      <div className='pb-3'>
        <Container className='py-5'>
          <Row className='d-flex justify-content-between'>
            <Col xs={12} lg={12}>
              <div className='container-price'>
                <div>
                  <Container className='container-price-item'>
                    <Row>
                      <Col className='d-flex align-items-start justify-content-start'>
                        Total:
                      </Col>
                      <Col className='d-flex align-items-start justify-content-end'>
                        {diasTranscurridos > 0
                          ? <strong>${totalPriceExt * Number(diasTranscurridos)}</strong>
                          : <strong>${totalPriceExt}</strong>
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
                          <p className='p-fecha text-center'>Fecha inicio Extensión</p>
                          <div className='d-flex align-items-center justify-content-center'>
                            <input type="date" selected={iniExtDate} onChange={((e) => setIniExtDate(e.target.value))} min={iniExtDate} required />
                          </div>
                          {/** <DatePicker selected={iniExtDate} onChange={(date) => setIniExtDate(date)} locale="es" dateFormat="yyyy-MM-dd" minDate={iniExtDate} />*/}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <div className='pb-5'>
                    <Container>
                      <Row className='d-flex align-items-center justify-content-center'>
                        <Col xs={12} lg={10}>
                          <p className='p-fecha text-center'>Fecha fin Extensión</p>
                          <div className='d-flex align-items-center justify-content-center'>
                            <input type="date" selected={finExtDate} onChange={((e) => setFinExtDate(e.target.value))} min={iniExtDate} required />
                          </div>
                          {/**<DatePicker selected={finExtDate} onChange={(date) => setFinExtDate(date)} locale="es" dateFormat="yyyy-MM-dd" minDate={iniExtDate} /> */}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <div className='py-2'>
                    <Container>
                      <Row>
                        <Col>
                          <button className='cart-button mx-auto mb-2 d-block btn btn-success' type='submit'>Pagar </button>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default AlquilerExtend