import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { getClienteByEmail } from '../../services/funciones';
import userProfile from '../../assets/usuario.png'
import './EditUser.css'
import { UserAuth } from '../../context/userContext'
import CartContext from '../../context/CartContext'

// TODO: en este archivo se debería renderizar todas las vistas de la cuenta de usuario
// TODO: como lo son, ver-productos-alquilados, ver-productos-en-alquiler, perfil (moficiar, alta producto talvez)

const Account = () => {

  const { user, logout } = UserAuth();

  const [clientes, setClientes] = useState('');

  //En caso de necesitar borrar los items de carrito al deslogear
  const [cart, setCart] = useContext(CartContext)

  //: TODO: USEFORM del edit cliente
  const { register, handleSubmit, control, reset, formState: { isDirty, errors } } = useForm()  

  //para fire y postgresql
  const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //para postgresql
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarCliente() {
      const response = await getClienteByEmail(user.email)
      if (response.status === 200) {
        setClientes(response.data)        
      }
      reset(response);
    }
    cargarCliente()
  }, [user, reset])

  //En caso de necesitar borrar los items de carrito al deslogear
  const vaciarCart = () =>{
    setCart([])
    localStorage.clear()
  }

  // TODO: FUNCIÓN LOGOUT DE USER
  const handleLogout = async () => {
    try {
      Swal.fire({
        title: 'Cierre de sesión',
        text: "¿Estás seguro que querés cerrar tu sesión?",
        icon: 'warning',
        iconColor: '#fff',
        color: '#fff',
        background: '#5a72d1',
        showCancelButton: true,
        confirmButtonColor: '#8341f4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Deslogeado',
            text: "Deslogeado correctamente",
            icon: 'success',
            color: '#fff',
            confirmButtonColor: '#050A30',
            background: '#5a72d1'
          })
          logout();
          navigate('/')
          vaciarCart()          
        }
      })
    } catch (error) {
      //console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      Swal.fire({
        title: 'Eliminar Cuenta',
        text: "¿Estás seguro que querés eliminar tu cuenta?",
        // icon: 'warning',
        iconHtml: '<i class="fa-solid fa-face-sad-cry"></i>',
        iconColor: '#fff',
        color: '#fff',
        background: '#5a72d1',
        showCancelButton: true,
        confirmButtonColor: '#8341f4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:5000/cliente/${user.uid}/${user.email}`)
          .then((response) =>{
            if (response.data == 'OK'){
              Swal.fire({
                title: 'Eliminado',
                text: "Eliminado correctamente",
                icon: 'success',
                color: '#fff',
                confirmButtonColor: '#050A30',
                background: '#5a72d1'
              })
              logout();
              navigate('/login')              
            }else{
              Swal.fire({
                title: 'Error al eliminar usuario',
                text: response.data.msg,
                icon: 'warning',
                color: '#fff',
                confirmButtonColor: '#050A30',
                background: '#f93333'
              })
            }
          })
        }
      })
    } catch (error) {
      //console.log("este es el error", error)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al eliminar el usuario',
        showConfirmButton: false,
      })
    }
  }



  // TODO: función para el submit del form para editar el clinete
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setError('');
    try {
      data.password = clientes.password;
      data.rol = clientes.rol;
      data.email = user.email;
      data.uid = user.uid;
      axios.put(`http://localhost:5000/cliente/${clientes.id_cliente}`, data)
      //`${baseUrl}/cliente/${email}`      
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#5a72d1',
        icon: 'success',
        iconColor: '#fff',
        title: 'Usuario modificado de manera correcta',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      navigate('/account')
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al modificar el usuario',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      setError(error.message)      
    }
  }


  return (
    <div>
      <Container className='py-5'>
        <Row>
          <Col xs={12} md={8} lg={6} className='pb-3'>
            {/* Dar logout */}
            <h1 className='py-5 text-center form-h1'>¡Bienvenido!</h1>
            <img src={userProfile} className="mg-flex  mx-auto d-block userImg img-thumbnail" alt="" />
            <h5 className='text-center form-h1'>Email:</h5>
            <p className='text-center text-white'>{user && user.email}</p>
            {/*<h5 className='text-center form-h1'>Calificación:</h5>
            <p className='text-center'><i className="fa-solid fa-star"></i></p>
             <h5 className='text-center form-h1'>Nombre:</h5>
            <p className='text-center' >{clientes.nombre}</p> */}
            <div>
              <button className='close-button mx-auto d-block' onClick={handleLogout}> <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión</button>
            </div>
            <div>
              <button className='delete-button mx-auto d-block mt-1' onClick={handleDelete}> <i className="fa-solid fa-heart-crack"></i> Eliminar cuenta</button>
            </div>
          </Col>

          <Col xs={12} md={8} lg={6}>
            {/* Parte del edit user */}
            <h1 className='py-5 text-center form-h1'>Edite su perfil <i className="fa-solid fa-user-gear"></i></h1>
            <form className="form-container-register" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label className='label-contact'>Nombre:*</label>
                <input
                  defaultValue={clientes.nombre}
                  className='form-control my-2'
                  type="text"
                  onChange={(e) => setNombre(e.target.value)}
                  {...register('nombre', {
                    minLength: {
                      value: 3,
                    },
                    maxLength: 20,
                    required: true
                  })} />
                {errors.nombre?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo direccion debe tener al menos 3 letras</p>}
                {errors.nombre?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo nombre debe tener menos de 20 caracteres</p>}
                {errors.nombre?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo nombre es requerido</p>}
              </div>
              <div className='mb-4'>
                <label className='label-contact'>Apellido:*</label>
                <input
                  defaultValue={clientes.apellido}
                  className='form-control my-2'
                  type="text"
                  onChange={(e) => setApellido(e.target.value)}
                  {...register('apellido', {
                    minLength: {
                      value: 4,
                    },
                    maxLength: 20,
                    required: true
                  })} />
                {errors.apellido?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo direccion debe tener al menos 4 letras</p>}
                {errors.apellido?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo apellido debe tener menos de 20 caracteres</p>}
                {errors.apellido?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo apellido es requerido</p>}
              </div>
              <div className='mb-4'>
                <label className='label-contact'>Dirección:*</label>
                <input
                  defaultValue={clientes.direccion}
                  className='form-control my-2'
                  type="text"
                  onChange={(e) => setDireccion(e.target.value)}
                  {...register('direccion', {
                    minLength: {
                      value: 4,
                    },
                    required: true
                  })} />
                {errors.direccion?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo direccion debe tener al menos 4 letras</p>}
                {errors.direccion?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo dirección es requerido</p>}
              </div>
              <div className='mb-4'>
                <label className='label-contact'>Teléfono:*</label>
                <input
                  defaultValue={clientes.telefono}
                  className='form-control my-2'
                  type="text"
                  placeholder="(Código de área) Número"
                  onChange={(e) => setTelefono(e.target.value)}
                  {...register('telefono', {
                    minLength: {
                      value: 10,
                    },
                    required: true
                  })} />
                {errors.telefono?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo teléfono debe tener al menos 10 números</p>}
                {errors.telefono?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo teléfono es requerido</p>}
              </div>
              <div className='mb-4'>
                <label className='label-contact'>Dirección de E-mail:*</label>
                <input
                  defaultValue={clientes.email}
                  className='form-control my-2'
                  readOnly="readonly"
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  {...register('email', {
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    required: true
                  })} />
                {errors.email?.type === 'pattern' && <p className='text-danger text-small d-block mb-2'>El formato del email es incorrecto</p>}
                {errors.email?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo email es requerido</p>}
              </div>
              <div className='d-flex justify-content-between'>
                <Button type="submit" className='edit-button mx-auto d-block'>Editar</Button>
              </div>
            </form>
          </Col>

          {/* <Col xs={12} md={8} lg={3}>
            {/* vacio 
          </Col> */}
        </Row>
      </Container>
    </div>
  )
}

export default Account