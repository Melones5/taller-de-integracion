import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Container } from 'react-bootstrap'
import './index.css'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import CartContext from '../../context/CartContext'

import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { UserAuth } from '../../context/userContext'

import { Rate } from 'antd';
import ProductDetail from './ProductDetail'

const ProductCard = ({ nombre, precio, urlfoto, categoria, id, descripcion, cantidad, cliente, valoracion }) => {

  const navigate = useNavigate();
  const { user } = UserAuth();

  const [cart, setCart, addToCart] = useContext(CartContext);

  const addProducts = () => {
    try {
      if (user) {
        if (quantityPerItem < cantidad) {
          addToCart(nombre, precio, urlfoto, categoria, id, descripcion, cantidad, cliente)
          Swal.fire({
            title: 'Agregado al carrito  de manera correcta',            
            icon: 'success',
            color: '#fff',
            background: '#5a72d1',
            showCancelButton: true,
            confirmButtonColor: '#8341f4',
            cancelButtonColor: '#49c240',
            confirmButtonText: 'Quiero seguir alquilando',
            cancelButtonText: 'Ver carrito'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/')
            } else {
              navigate('/cart')
            }
          })          
        } else {
          Swal.fire({
            position: 'center',
            width: '32em',
            color: '#fff',
            background: '#f93333',
            icon: 'error',
            iconColor: '#fff',
            title: 'Producto fuera de stock',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2500
          })
        }
      } else {
        Swal.fire({
          position: 'center',
          width: '32em',
          color: '#fff',
          background: '#f93333',
          icon: 'error',
          iconColor: '#fff',
          title: 'Para agregar al carrito debe estar logeado / registrado en la página',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2500
        })
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error en el trycatch',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
    }
  }  

  const getQuantityById = (id) => {
    return cart.find((item) => item.id === id)?.quantity || 0;
  }

  const quantityPerItem = getQuantityById(id);

  return (
    <Card className='product-card h-100'>
      <Container>
        <Row>
          <Col className="d-flex justify-content-end">
            {
              quantityPerItem > 0 && (
                <div>{quantityPerItem} <i className="fa-solid fa-cart-shopping"></i></div>
              )
            }
          </Col>
        </Row>
      </Container>
      <Link to={`/product-detail/${id}`} style={{ textDecoration: "none" }} >
        <Card.Img variant="top" src={urlfoto} width="144px" height="144px" className='product-img' />
      </Link>
      <Card.Body className="text-center">
        <Card.Title className='product-title'>{nombre}</Card.Title>
        {/* <Card.Text className='product-text'>{descripcion}</Card.Text> */}
        <Card.Text className='product-text'>{categoria}</Card.Text>
      </Card.Body>
      <div className='price-container'>
        <Card.Text className='product-price center'>${precio}</Card.Text>
        <span className='d-flex justify-content-center text-grey'>(precio por día)</span>
      </div>
      {/**Puede ir como no la valoración */}
      <div className='d-flex justify-content-center align-items-center'>
        <Rate defaultValue={valoracion} disabled style={{ color: "red" }} tooltips={["Malo", "No tan malo", "Normal", "Bueno", "Excelente"]} />
      </div>
      <div className='pt-2'>
        <Button className='product-button' onClick={() => addProducts()}>Añadir a carrito</Button>      
      </div>
    </Card>
  )
}

export default ProductCard