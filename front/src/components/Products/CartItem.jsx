import React, { useContext } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import CartContext from '../../context/CartContext'

import { Button } from 'primereact/button'

import Swal from 'sweetalert2'
import { UserAuth } from '../../context/userContext'


const CartItem = ({ nombre, precio, urlfoto, categoria, id, descripcion, cantidad, cliente, quantity }) => {

  const [cart, setCart, addToCart, removeItem] = useContext(CartContext)

  const { user } = UserAuth();

  const addProducts = () => {
    try {
      if (user) {
        if (quantityPerItem < cantidad) {
          addToCart(nombre, precio, urlfoto, categoria, id, descripcion, cantidad, cliente)        
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
            timer: 1500
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

  //TODO: ELIMINAR DEL CARRITO Y DEL LOCAL STORAGE
  const eliminarProducto = (id) => {
    const prodEliminar = cart.filter((producto) => producto.id !== id)
    setCart(prodEliminar)
  }

  const getQuantityById = (id) => {
    return cart.find((item) => item.id === id)?.quantity || 0;
  }

  const quantityPerItem = getQuantityById(id);

  return (
    <div>
      <Row className='row-products' key={id}>
        <Col xs={12} lg={3} className='m-auto d-block'>
          <img src={urlfoto} style={{ width: '70%' }} alt="" className='m-auto mb-3 d-block img-thumbnail img-table' />
        </Col>
        <Col xs={12} lg={3}>
          <p className='p-row'><strong>Nombre:</strong> {nombre}</p>
          <p className='p-row'><strong>Precio por día:</strong> ${precio}</p>
          <p className='p-row'> <strong>Unidades: {quantity}</strong></p>
          <div className='d-flex justify-content-between py-1' xs={2}>
            <Button  className='p-button-secondary p-button-sm' onClick={() => removeItem(id)}>-</Button>
            <input value={quantity} className='cartInput' disabled/>
            <Button className='p-button-secondary p-button-sm' onClick={() => addProducts()}>+</Button>
          </div>
        </Col>
        <Col className='d-flex align-items-start justify-content-end' xs={12} lg={3}>
          <button className='btn btn-danger cart-button' onClick={() => eliminarProducto(id)}>Eliminar <i className="fa-solid fa-trash"></i></button>
        </Col>
      </Row >
    </div >
  )
}

export default CartItem