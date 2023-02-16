import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import ProductCard from './ProductCard'
import { getProductos } from '../../services/funciones';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

// TODO: esto puede servir para controlar que el usuario este logeado para agregar al carrito
import { UserAuth } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import FilterProduct from './Header_Category/FilterProduct';
import { useContext } from 'react';
import CartContext from '../../context/CartContext';


const Product = () => {
  //esta línea controla que no se haga el 2do render del useEffect
  //para no tener problemas con los inserts dobles a postgresql
  const effectRan = useRef(false)

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (effectRan.current === false) {
      cargarProductos()
      return () => {        
        effectRan.current = true
      }
    }
  }, []);

  // TODO: TRAIGO LAS FUNCIONES ESPECÍFICAS DESDE EL ARCHIVO SERVICES
  async function cargarProductos() {
    const response = await getProductos()
    if (response.status === 200) {
      setProductos(response.data)      
    }
  }

  const { addToCart } = useContext(CartContext)

  // TODO: esto puede servir para controlar que el usuario este logeado para agregar al carrito
  const { user } = UserAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  // TODO: acá va el filtro por categoría con su estado
  const [filterCategoria, setFilterCategoria] = useState('');


  //función que filtra y retorna el producto en la categoría adecuada
  const filteredProductList = productos.filter((producto) => {
    if (filterCategoria === '1') {
      return producto.categoria === 1;
    } else if (filterCategoria === '2') {
      return producto.categoria === 2;
    } else if (filterCategoria === '3') {
      return producto.categoria === 3;
    } else if (filterCategoria === '4') {
      return producto.categoria === 4;
    } else {
      return producto
    }
  })

  //funciones que sirven para ordenar por precio a los productos. 
  const [orden, setOrden] = useState('')

  const ordenarPorMenorPrecio = (array) => {
    return ([...array].sort((a, b) => {
      if (a.precio < b.precio)
        return -1;
      else if (a.precio > b.precio)
        return 1;
      return 0
    }))
  }


  const ordenarPorMayorPrecio = (array) => {
    return ([...array].sort((a, b) => {
      if (a.precio > b.precio)
        return -1;
      else if (a.precio < b.precio)
        return 1;
      return 0
    }))
  }

  useEffect(() => {
    let porOrdenar = productos
    if (orden === '1')
      setProductos(ordenarPorMenorPrecio(porOrdenar))
    else if (orden === '2')
      setProductos(ordenarPorMayorPrecio(porOrdenar))
  }, [orden])


  const handleSearch = async (e) => {
    setSearch(e.target.value);
  }
  const handleSubmitSearch = (e) => {
    e.preventDefault();
  }

  //función que filtra por categoría
  function onFilterValueSelected(filterValue) {
    setFilterCategoria(filterValue);
  }


  return (
    <Fragment>
      <Container className='pt-1'>
        <div>
          <Row className='main-selects py-3'>
            {/* busca por categorías */}
            <Col className='pt-1' md="auto" xs={12} lg={4}>
              <div>
                <div className="text-white">Ordenar por categoría</div>
                <FilterProduct filterValueSelected={onFilterValueSelected} />
              </div>
            </Col>
            {/* filtro por precio */}
            <Col className='pt-1' md="auto" xs={12} lg={4}>
              <label className="text-white">Filtrar por: </label>
              <select name='Categoria' className="form-select" onChange={e => setOrden(e.target.value)}>
                <option value='1'>Precio - Menor a Mayor</option>
                <option value='2'>Precio - Mayor a Menor</option>
              </select>
            </Col>
            {/* búsqueda */}
            <Col className='pt-1' md="auto" xs={12} lg={4}>
              <div className="text-white">Buscá un producto</div>
              <Form onSubmit={handleSubmitSearch}>
                <InputGroup className='main'>
                  <Form.Control onChange={handleSearch} className='input-search' placeholder='Buscar producto...' />
                  <a className='icon-search'><i className="fa-solid fa-magnifying-glass"></i></a>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>     

      <Container className='container-product py-5'>
        <Row xs={1} md={2} lg={4} className="g-3">
          {filteredProductList
            .filter((producto) => {
              if (search === '') {
                return producto
              } else if (producto.nombre_producto.toLowerCase().includes(search.toLowerCase())) {
                return producto
              }
            })
            .map((producto, key) => {
              return (
                <Col key={producto.id_producto}>
                  <ProductCard
                    urlfoto={producto.urlfoto}
                    nombre={producto.nombre_producto}
                    descripcion={producto.descripcion_producto}
                    categoria={producto.categoria_producto}
                    precio={producto.precio}
                    id={producto.id_producto}
                    cantidad={producto.cantidad}
                    cliente={producto.cliente}
                    /**Paso la valoración al card producto para mostrarla en el home */
                    valoracion={producto.valoracion}
                  />
                </Col>
              )
            })}
        </Row>
      </Container>
    </Fragment>
  )
}

export default Product