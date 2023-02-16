import React, { useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './index.css'
import CartContext from '../../context/CartContext';
import { useContext } from 'react';
import { UserAuth } from '../../context/userContext'
import imgLogo from '../../assets/logoRental.png'

const Header = () => {
  // const { productos } = useContext(CartContext);
  const { user } = UserAuth();
  const [showNav, setShowNav] = useState('false');

  const [cart, setCart] = useContext(CartContext)

  const quantity = cart.reduce((acc, curr) =>{
    return acc + curr.quantity;
  }, 0);
  
  if (user === null) {
    return (
      <header>
        <Navbar className="navbar-bg" expand="lg" collapseOnSelect fixed="top">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className='burger' />
            <Navbar.Brand href="/" className="text-white">
              <img src={imgLogo} widht="40" height="40" alt="logo" />
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">

              <Nav className="ms-auto navbar-header py-2">

                <NavLink exact="true" to="/" className="py-1 px-2 cursor-pointer" >Inicio</NavLink>
               {/*<NavLink exact="true" to="/contact" className="py-1 px-2 cursor-pointer" >Contacto</NavLink>*/}
                <NavLink exact="true" to="/contactv2" className="py-1 px-2 cursor-pointer" >Contacto</NavLink>

                <NavLink exact="true" to="/help" className="py-1 px-2 cursor-pointer" >Ayuda</NavLink>

                <NavLink exact="true" to="/login" className="py-1 px-2 cursor-pointer" ><i className="fa-solid fa-right-to-bracket fa-sm"></i> Ingresá</NavLink>    

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    )
  }
  return (
    <header>
      <Navbar className="navbar-bg" expand="lg" collapseOnSelect fixed="top">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='burger' />
          <Navbar.Brand href="/" className="text-white">
            <img src={imgLogo} widht="40" height="40" alt="logo" />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="ms-auto navbar-header py-2">

              <NavLink exact="true" to="/" className="py-1 px-2 cursor-pointer" >Inicio</NavLink>
              <NavLink exact="true" to="/contactv2" className="py-1 px-2 cursor-pointer" >Contacto</NavLink>
              
              {/* Productos alquilados */}
              <NavLink exact="true" to="/productos_alquilados" className="py-1 px-2 cursor-pointer"><i className="fa-solid fa-boxes-packing fa-sm"></i>  Mis Alquileres</NavLink>
              <NavLink exact="true" to="/productos_alquiler" className="py-1 px-2 cursor-pointer"><i className="fa-solid fa-box-open fa-sm"></i> Mis Productos</NavLink>
              <NavLink exact="true" to="/account" className="py-1 px-2 cursor-pointer" ><i className="fa-solid fa-user fa-sm"></i> Cuenta</NavLink>

              <NavLink exact="true" to='/cart' className="py-1 px-2 cursor-pointer" > {quantity} <i className="fa-solid fa-cart-shopping fa-sm"></i> </NavLink>

            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
