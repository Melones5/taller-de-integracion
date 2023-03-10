import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Button, Form } from 'react-bootstrap';
//import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

//google auth
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import auth from '../../firebase-config';


import { UserAuth } from '../../context/userContext'

import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import './Form.css';



const FormRegister = () => {

  let navigate = useNavigate();
  const { createUser } = UserAuth();

  //para fire y postgresql
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //para postgresql
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm(
    {
      defaultValues: {
        uid: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        rol: 'ARRENDADOR',
      }
    });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setError('');
    try {
      const crear = await createUser(data.email, data.password);
      data.uid = crear.user.uid;
      axios.post('http://localhost:5000/cliente', data)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#5a72d1',
        icon: 'success',
        iconColor: '#fff',
        title: 'Usuario registrado de manera correcta',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      navigate('/')
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al agregar el usuario. El correo ya est?? en uso :C',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      setError(error.message)
    }
  }

  //REGISTER CON GOOGLE
  const [user, setUser] = useState({})
  const provider = new GoogleAuthProvider();

  const handleClick = async () => {
    try {
      const user = await signInWithPopup(auth, provider).then((data) => {
        setUser(data.user.email)              
        data.uid = data.user.uid;
        data.email= data.user.email;
        data.rol = 'ARRENDADOR';
        axios.post('http://localhost:5000/cliente_google', data)
        Swal.fire({
          position: 'center',
          width: '32em',
          color: '#fff',
          background: '#5a72d1',
          icon: 'success',
          iconColor: '#fff',
          title: 'Usuario registrado de manera correcta',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2500
        })
        navigate('/')
      });      
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al agregar el usuario. El correo ya est?? en uso :C',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      setError(error.message)
    }
  }

  return (
    <div>
      <h1 className='pt-5 form-h1'>Registrarse</h1>
      <h5 className='form-h5'>??Registrate es gratis!</h5>
      <form className=" form-container-register" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label className='label-contact'>Nombre:*</label>
          <input className='form-control my-2' type="text" onChange={(e) => setNombre(e.target.value)} {...register('nombre', {
            required: true,
            maxLength: 10
          })} />
          {errors.nombre?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo nombre es requerido</p>}
          {errors.nombre?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo nombre debe tener menos de 10 caracteres</p>}
        </div>
        <div className='mb-4'>
          <label className='label-contact'>Apellido:*</label>
          <input className='form-control my-2' type="text" onChange={(e) => setApellido(e.target.value)}{...register('apellido', {
            required: true,
            maxLength: 10
          })} />
          {errors.apellido?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo apellido es requerido</p>}
          {errors.apellido?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo apellido debe tener menos de 10 caracteres</p>}
        </div>
        <div className='mb-4'>
          <label className='label-contact'>Direcci??n:*</label>
          <input className='form-control my-2' type="text" onChange={(e) => setDireccion(e.target.value)} {...register('direccion', {
            required: true,
            minLength: {
              value: 4,
            }
          })} />
          {errors.direccion?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo direcci??n es requerido</p>}
          {errors.direccion?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo direccion debe tener al menos 4 letras</p>}
        </div>
        <div className='mb-4'>
          <label className='label-contact'>Tel??fono:*</label>
          <input className='form-control my-2' type="text" placeholder="(C??digo de ??rea) N??mero" onChange={(e) => setTelefono(e.target.value)} {...register('telefono', {
            required: true,
            minLength: {
              value: 10,
            }
          })} />
          {errors.telefono?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo tel??fono es requerido</p>}
          {errors.telefono?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo tel??fono debe tener al menos 10 n??meros</p>}
        </div>
        <div className='mb-4'>
          <label className='label-contact'>Direcci??n de E-mail:*</label>
          <input className='form-control my-2' type="text" onChange={(e) => setEmail(e.target.value)} {...register('email', {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
          })} />
          {errors.email?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo email es requerido</p>}
          {errors.email?.type === 'pattern' && <p className='text-danger text-small d-block mb-2'>El formato del email es incorrecto</p>}
        </div>
        <div className='mb-4'>
          <label className='label-contact'>Contrase??a:*</label>
          <input className='form-control my-2' type="password" onChange={(e) => setPassword(e.target.value)} {...register('password', {
            required: true,
            minLength: {
              value: 6,
            }
          })} />
          {errors.password?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo contrase??a es requerido</p>}
          {errors.password?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>La contrase??a debe tener al menos 6 letras</p>}
        </div>
        <div className='mb-4 d-flex justify-content-between aling-items-end'>        
          <label className='label-contact'>T??rminos y condiciones
            <div className='pl-2'>
              <input type='checkbox'{...register('aceptarTer')}/>
            </div>
          </label>          
        </div>
        {/* <div className='mb-4'> 
          <label className='label-contact'>Rol:*</label>
          <select aria-label="Default select example my-2" {...register('rol', {required: true})}>
            <option value="ARRENDADOR">ARRENDADOR</option>
            <option value="PROPIETARIO">PROPIETARIO</option>
          </select>
          {/* <input className='form-control my-2' type="text" {...register('rol', { 
            required: true,
            minLength: {
              value: 7,
            }
          })} />
          {errors.rol?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo rol es requerido</p>}
        </div>*/}
        <div className='mb-4'>
          <button className='btn register-button my-2'>Registrarme</button>
        </div>
        <div className='container'>
          <div className='row'>
            <hr />
            <p className='text-center label-contact'>
              Registrate con tus redes sociales
            </p>
            <div className='d-flex flex-row mb-3 justify-content-center social-media'>
              {/**<Button className='social-icon facebook'>
                 <FaFacebookF />
              </Button>*/}
              <Button onClick={handleClick} className='social-icon google'>
                <FaGoogle />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormRegister