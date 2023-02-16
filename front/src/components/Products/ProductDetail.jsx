import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios';
import './ProductDetail.css';
import moment from 'moment'
import { UserAuth } from '../../context/userContext'
import { Rate } from 'antd';


const ProductDetail = () => {
  //esta línea controla que no se haga el 2do render del useEffect
  //para no tener problemas con los inserts dobles a postgresql
  const effectRan = useRef(false)


  const { id_producto } = useParams();

  const { user } = UserAuth();

  const [items, setItems] = useState([]);

  const [review, setReview] = useState([]);

  useEffect(() => {
    if (effectRan.current === false) {
      getProducto(id_producto)
      getReview(id_producto)
      return () => {
        effectRan.current = true
      }
    }
  }, [])

  const getProducto = async (id_producto) => {
    const response = await axios.get(`http://localhost:5000/producto/${id_producto}`)
    if (response.status === 200) {
      setItems(response.data)
    }
  }
  const getReview = async (id_producto) => {
    const response = await axios.get(`http://localhost:5000/review/${id_producto}`)
    if (response.status === 200) {
      setReview(response.data)
    }
  }

  return (
    <Fragment>
      <Container className='py-5'>
        <Row className='py-5'>
          <div className="cart-i d-flex aling-items-center">
            <Link to={'/'} style={{ textDecoration: "none" }}>
              <span><i className="fa-solid fa-left-long cart-a"></i></span>
            </Link>
          </div>
          {items.map((item, i) => {
            return (
              <Fragment key={item.id_producto}>
                <Col xs={12} md={8} lg={8} className='pb-5'>
                  <img src={item.urlfoto} alt="img_producto" style={{ width: '70%' }} className="m-auto mb-3 d-block img-table img-thumbnail" />
                </Col>
                <Col xs={12} md={8} lg={4} className='container-col'>
                  <div className='container-descripcion'>
                    <h3 className='detail-h3'>{item.nombre_producto}</h3>
                    <p className='p-text'>{item.descripcion_producto}</p>
                  </div>
                  <div className='container-detalles'>
                    <h3 className='detail-h3'> <i className="fa-solid fa-file-lines"></i> Detalles del producto</h3>
                    <ul className='detail-ul' key={i}>
                      <li className='text-white'><strong>Precio por día:</strong> ${item.precio}</li>
                      {/**Condicional para evaluar stock (disponible / no disponible)*/}
                      {item.cantidad > 0
                        ? <li className='p-stock'><strong>Stock:</strong> {item.cantidad}</li>
                        : <li className='p-stock-red'><strong>Sin stock:</strong> {item.cantidad}</li>
                      }
                      <li className='text-white'><strong>Estado:</strong> {item.estado}</li>
                      <li className='text-white'><strong>Dueño:</strong> {item.cliente}</li>
                    </ul>
                  </div>
                  <div className='container-descripcion'>
                    <h3 className='detail-h3'> <i className="fa-solid fa-star"></i> Calificación</h3>
                    <Rate defaultValue={item.valoracion} disabled style={{ color: "red" }} />
                    {/** <p className='p-text'>Cantidad unidades : <input type="number" onChange={e => setValor(e.target.value)} name="quantity" defaultValue="1" min="1" max={item.cantidad} /></p>
                    <div className='pt-2'>
                      <button className='detail-button'>Añadir a carrito <i className="fa-solid fa-cart-shopping"></i> </button>
                    </div>*/}
                  </div>
                </Col>
              </Fragment>
            )
          })}
        </Row>
      </Container>

      <Container>
        <ul className='detail-ul'>
          <h3 className='detail-h3 mt-5 mb-5'><i className="fa-solid fa-comment-dots"></i> Otros usuarios valoraron</h3>
          {review.map((item) => {
            return (
              <Fragment key={item.id_valoracion}>
                <li className='li-comment py-1'>
                  <Row className='row-comment'>
                    <Col xs={12} md={1} lg={2} className='center'>
                      <i className="fa-solid fa-user text-white"></i>
                    </Col>
                    <Col xs={12} md={11} lg={10}>
                      <Rate defaultValue={item.valoracion} disabled style={{ color: "red" }} className='d-flex justify-content-end'/>
                      <p className='p-text pt-3'>{item.comentario}</p>
                      <p className='p-li-date text-white'>{moment(item.fecha).format('DD/MM/yyyy')}</p>
                    </Col>
                  </Row>
                </li>
              </Fragment>
            )
          })}
        </ul>
      </Container>
    </Fragment>
  )
}

export default ProductDetail