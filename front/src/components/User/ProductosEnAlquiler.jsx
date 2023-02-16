import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col } from 'react-bootstrap';
import './EditUser.css';
import InputGroup from 'react-bootstrap/InputGroup';
// TODO: imports de lo necesario para hacer post
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
// TODO: imports para obtener el id del usuario logeado
import { UserAuth } from '../../context/userContext'
import { getClienteByEmail, getProductoCliente } from '../../services/funciones';
//TODO: importe para el edit producto
import { Link } from 'react-router-dom'
import FilterProduct from '../Products/Header_Category/FilterProduct';
//TODO: importe la función para subir la imagen
import { subirArchivo } from '../../firebase-config'


const ProductosEnAlquiler = () => {

  // TODO: Usuario logeado y seteo del mismo en el estado clientes
  // Importante entender que si o si un usuario debe estar logeado para agregar productos y obtener el id
  const { user } = UserAuth();
  const [clientes, setClientes] = useState('');

  let navigate = useNavigate();

  // TODO: controles del modal
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => {
    setShow(true);
  }

  const [error, setError] = useState('');


  //para postgresql
  const [nombreProducto, setNombreProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [estadoProducto, setEstadoProducto] = useState('');
  const [urlProducto, setUrlProducto] = useState(null);
  const [valoracion, setValoracion] = useState();
  const [categoriaProducto, setCategoriaProducto] = useState('');
  const [clienteProducto, setClienteProducto] = useState('');


  // TODO: acá van el seteo de los productos del cliente logeado
  const [productos, setProductos] = useState([]);

  // TODO: acá se setea el valor que ingresa en el input el usuario para buscar producto
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
    } else if (filterCategoria === '5') {
      return producto
    } else if (filterCategoria === '6') {
    } else {
      return producto
    }
  })

  // TODO: useForm que controla el add de producto nuevo
  const { register, handleSubmit, formState: { errors } } = useForm(
    {
      defaultValues: {
        nombre_producto: '',
        precio: '',
        descripcion_producto: '',
        cantidad: '',
        estado: '',
        urlfoto: '',
        valoracion: '',
        categoria: '',
        cliente: '',
      }
    });

  useEffect(() => {
    cargarCliente()
    cargarProductos()
  }, [user])


  //función que carga los productos de un determinado cliente
  const cargarProductos = async () => {
    const response = await getProductoCliente(user.email)
    if (response.status === 200) {
      setProductos(response.data)
    }
  }

  //funcion que cargar el cliente
  const cargarCliente = async () => {
    const response = await getClienteByEmail(user.email)
    if (response.status === 200) {
      setClientes(response.data)
    }
  }

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


  //Función submit que inserta el producto nuevo.
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setError('');
    try {
      data.cliente = user.email;
      data.valoracion = 0;
      data.urlfoto = await subirArchivo(urlProducto);
      axios.post('http://localhost:5000/producto', data)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#5a72d1',
        icon: 'success',
        iconColor: '#fff',
        title: 'Producto agregado de manera correcta',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500
      })
      navigate('/productos_alquiler')
      window.setTimeout(function () { window.location.reload() }, 1500)
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al agregar el producto',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      setError(error.message)
    }

  }

  //Función delete que borra un producto.
  function deleteProduct(id_producto) {
    try {
      if (user) {
        Swal.fire({
          title: 'Eliminar producto',
          text: "¿Estás seguro que querés eliminar este producto?",
          icon: 'warning',
          color: '#fff',
          iconColor: '#fff',
          background: '#5a72d1',
          showCancelButton: true,
          confirmButtonColor: '#8341f4',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Eliminado',
              text: "Eliminado correctamente",
              icon: 'success',
              color: '#fff',
              confirmButtonColor: '#050A30',
              background: '#5a72d1'
            })
            axios.delete(`http://localhost:5000/producto/${id_producto}`)
            setProductos(productos.filter(producto => producto.id_producto !== id_producto))
            navigate('/productos_alquiler')
          }
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
        title: 'Error al eliminar este producto',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
    }
  }

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
    <div className='py-5'>
      <div className='pt-3 pb-3'>
        <Container>
          <Row className='d-flex justify-content-between aling-items-center'>
            <Col xs={6} lg={3} className='d-flex justify-content-left aling-items-center'>
              <Button className='add-button' onClick={handleShow}>
                Agregar producto <i className="fa-solid fa-square-plus"></i>
              </Button>
            </Col>
            <Col xs={6} lg={3} className='d-flex justify-content-end aling-items-center'>
              <Link to={`/alquileres-activos/${user.email}`}>
                <Button className='alquiler-button'>
                  Alquileres Activos <i className="fa-solid fa-truck-ramp-box"></i>
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="container-search mb-5" fluid>
        <Row className='main-selects py-3'>
          {/* ordena por categorías */}
          <Col className='pt-1' md="auto" xs={12} lg={4}>
            <div>
              <div className="text-white pb-1">Ordenar por categoría</div>
              <FilterProduct filterValueSelected={onFilterValueSelected} />
            </div>
          </Col>
          {/* ordena por nombre y precio */}
          <Col className='pt-1' md="auto" xs={12} lg={4}>
            <div className="text-white pb-1">Filtrar por:</div>
            <select name='precio' className="form-select" onChange={e => setOrden(e.target.value)}>
              <option value='1'>Precio - Menor a Mayor</option>
              <option value='2'>Precio - Mayor a Menor</option>
            </select>
          </Col>
          {/* Buscar producto */}
          <Col className='pt-1' md="auto" xs={12} lg={4}>
            <div>
              <Form onSubmit={handleSubmitSearch}>
                <div className="text-white pb-1">Buscá un producto</div>
                <InputGroup className='main'>
                  <Form.Control onChange={handleSearch} placeholder='Buscar producto...' className='input-search' />
                  <a href="#" className='icon-search'><i className="fa-solid fa-magnifying-glass"></i></a>
                  {/* <InputGroup.Text id="basic-addon1"><i class="fa-solid fa-magnifying-glass"></i></InputGroup.Text> */}
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>
        <Container className='py-2'>
          <h3 className='detail-h3 py-5 text-center'> <i className="fa-solid fa-box-open "></i> Lista de productos</h3>
          {/* TODO: Diferentes métodos para el array producto del Alquiler productos*/}
          {filteredProductList
            .filter((producto) => {
              if (search === '') {
                return producto
              } else if (producto.nombre_producto.toLowerCase().includes(search.toLowerCase())) {
                return producto
              }
              return false;
            })
            .map((producto, index) => (
              <div key={index}>
                <Row className='row-products'>
                  <Col xs={12} lg={3} className='m-auto d-block'>
                    <img src={producto.urlfoto} alt="" className='m-auto mb-3 d-block img-thumbnail img-table' />
                  </Col>
                  <Col xs={12} lg={3}>
                    <p className='p-row'><strong>Nombre:</strong> {producto.nombre_producto}</p>
                    <p className='p-row'><strong>Precio:</strong> ${producto.precio}</p>
                    <p className='p-row'><strong>Descripción:</strong> {producto.descripcion_producto}</p>
                  </Col>
                  <Col xs={12} lg={3}>
                    {/**Condicional para evaluar stock (disponible / no disponible)*/}
                    {producto.cantidad > 0
                      ? <p className='p-row p-stock'> <strong>Disponibles:</strong> {producto.cantidad}</p>
                      : <p className='p-row p-stock-red'> <strong>Sin stock: </strong> {producto.cantidad}</p>
                    }
                    <p className='p-row'><strong>Estado:</strong> {producto.estado}</p>
                    <p className='p-row'><strong>Categoría:</strong> {producto.categoria}</p>
                  </Col>
                  <Col xs={12} lg={3}>
                    <p className='p-row'><strong>Acciones</strong></p>
                    <Link to={`/edit-product/${producto.id_producto}`} style={{ textDecoration: "none" }}>
                      <Button className='btn btn-primary mb-3 d-flex'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                    <Button className='btn btn-danger d-flex' onClick={() => deleteProduct(producto.id_producto)}><i className="fa-solid fa-trash"></i></Button>
                  </Col>
                </Row>
              </div>
            ))}
        </Container>
      </Container>


      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant='white'>
          <Modal.Title className='text-white mb-1 form-h1'>Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12} lg={6}>
                <div className='mb-4'>
                  <label className='label-contact'>Nombre:*</label>
                  <input className='form-control my-2' type="text" onChange={(e) => setNombreProducto(e.target.value)} {...register('nombre_producto', {
                    required: true,
                    maxLength: 50
                  })}
                  />
                  {errors.nombre_producto?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo nombre es requerido</p>}
                  {errors.nombre_producto?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo nombre debe tener menos de 50 caracteres</p>}
                </div>
              </Col>
              <Col xs={12} lg={6}>
                <div className='mb-4'>
                  <label className='label-contact'>Precio:*</label>
                  <input className='form-control my-2' type="number" defaultValue="1" min="1" onChange={(e) => setPrecioProducto(e.target.value)}{...register('precio', {
                    required: true,
                    maxLength: 10,
                    minLength: 1,
                  })}
                    placeholder='Ej: 120'
                  />
                  {errors.precio?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo precio es requerido</p>}
                  {errors.precio?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo precio debe tener menos de 10 caracteres</p>}
                  {errors.precio?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo precio debe tener menos de 1 caracter</p>}
                </div>
                {/* <div className='mb-4'>
                  <label className='label-contact'>Precio:*</label>
                  <input className='form-control my-2' type="text" onChange={(e) => setPrecioProducto(e.target.value)}{...register('precio', {
                    required: true,
                    maxLength: 10
                  })} />
                  {errors.precio?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo precio es requerido</p>}
                  {errors.precio?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo precio debe tener menos de 10 caracteres</p>}
                </div> */}
              </Col>
            </Row>
            <div className='mb-4'>
              <label className='label-contact'>Descripcion:*</label>
              <div className="form-outline">
                <textarea className="form-control my-2" id="textoDescripcion" rows="4" type="text" onChange={(e) => setDescripcionProducto(e.target.value)} {...register('descripcion_producto', {
                  required: true,
                  minLength: {
                    value: 4,
                  },
                  maxLength: 255
                })}
                  placeholder='Ej: "Producto que se puede usar en..."'
                >
                </textarea>
                {errors.descripcion_producto?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo Descripción es requerido</p>}
                {errors.descripcion_producto?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo Descripción debe tener al menos 4 letras</p>}
                {errors.descripcion_producto?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo Descripción debe tener menos 255 letras</p>}
              </div>
            </div>
            <Row>
              <Col xs={12} lg={6}>
                <div className='mb-4'>
                  <label className='label-contact'>Cantidad:*</label>
                  <input className='form-control my-2' type="number" defaultValue="1" min="1" onChange={(e) => setCantidadProducto(e.target.value)} {...register('cantidad', {
                    required: true,
                    minLength: {
                      value: 1,
                    },
                    maxLength: 10
                  })}
                    placeholder='Ej: 1'
                  />
                  {errors.cantidad?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo Cantidad es requerido</p>}
                  {errors.cantidad?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo cantidad debe ser al menos 1</p>}
                  {errors.cantidad?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo cantidad menos de 10 caracteres</p>}
                </div>
              </Col>
              <Col xs={12} lg={6}>
                <div className='mb-4'>
                  <label className='label-contact'>Estado del producto:*</label>
                  <input className='form-control my-2' type="text" onChange={(e) => setEstadoProducto(e.target.value)} {...register('estado', {
                    required: true,
                    minLength: {
                      value: 4,
                    },
                    maxLength: 15
                  })}
                    placeholder='Ej: Buen estado'
                  />
                  {errors.estado?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo Estado es requerido</p>}
                  {errors.estado?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo Estado debe tener al menos 4 letras</p>}
                  {errors.estado?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo Estado debe tener menos de 15 caracteres</p>}
                </div>
              </Col>
            </Row>
            {/** <div className='mb-4'>
              <label className='label-contact'>Url del producto:*</label>
              <input className='form-control my-2' type="text" onChange={(e) => setUrlProducto(e.target.value)} {...register('urlfoto', {
                required: true,
                minLength: {
                  value: 4,
                }
              })} />
              {errors.urlfoto?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo Url es requerido</p>}
              {errors.urlfoto?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo Url debe tener al menos 4 letras</p>}
            </div>*/}
            <div className='mb-4'>
              <label className='label-contact'>Imagen del producto:*</label>
              <input className='form-control my-2' type="file" onChange={(e) => setUrlProducto(e.target.files[0])} required />
              {errors.urlfoto?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo Imágen es requerido</p>}
            </div>
            <Row>
              <Col xs={12} lg={6}>
                <div className='mb-4'>
                  <label className='label-contact'>Categoria del producto:*</label>
                  <select className="form-select my-2" aria-label="Default select example" onChange={(e) => setCategoriaProducto(e.target.value)} {...register('categoria', {
                    required: true,
                    minLength: {
                      value: 1,
                    }
                  })} >
                    <option value="1">Artículos de playa</option>
                    <option value="2">Artículos de camping</option>
                    <option value="3">Artículos deportivos</option>
                    <option value="4">Herramientas</option>
                  </select>
                  {errors.categoria?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo Categoria es requerido</p>}
                  {errors.categoria?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo Categoria debe tener al menos 1 letras</p>}
                </div>
              </Col>
            </Row>
            <button className='btn register-button my-2'>Agregar</button>
          </Form>
        </Modal.Body>
      </Modal>
      <Container className='pb-4 pt-4'>
      </Container>
    </div>
  )
}

export default ProductosEnAlquiler