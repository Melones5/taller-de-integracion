import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import swal from 'sweetalert';
import Swal from 'sweetalert2'


import { UserAuth } from '../../context/userContext'

import axios from "axios";
import { useNavigate } from 'react-router-dom';

//google auth
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import auth from '../../firebase-config';

import './Form.css';



const FormLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { signIn } = UserAuth();


  const { register, handleSubmit, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        email: '',
        password: '',
      }
    });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setError('')
    try {
      await signIn(data.email, data.password)
      //axios.post('http://localhost:5000/login', data)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#5a72d1',
        icon: 'success',
        iconColor: '#fff',
        title: 'Usuario logeado de manera correcta',
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
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
        title: 'Correo o contraseña incorrecto',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      setError(error.message)
    }
  }

  //LOGIN CON GOOGLE
  const [user, setUser] = useState({})
  const provider = new GoogleAuthProvider();

  const handleClick = async () => {
    try {
      const user = await signInWithPopup(auth, provider).then((data) => {
        setUser(data.user.email)
        Swal.fire({
          position: 'center',
          width: '32em',
          color: '#fff',
          background: '#5a72d1',
          icon: 'success',
          iconColor: '#fff',
          title: 'Usuario logeado de manera correcta',
          confirmButtonText: "Aceptar",
          showConfirmButton: true,
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
        title: 'Correo o contraseña incorrecto',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      setError(error.message)      
    }
  }

  return (
    <div>
      <h1 className='pt-5 form-h1'>Acceder</h1>
      <h5 className='form-h5'>¡Si tiene una cuenta, acceda!</h5>
      <form className='form-container-login' autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label className='label-contact'>Dirección de E-mail:*</label>
          <input className='form-control my-2' type="text" onChange={(e) => setEmail(e.target.value)} {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
          })} />
          {errors.email?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo email es requerido</p>}
          {errors.email?.type === 'pattern' && <p className='text-danger text-small d-block mb-2'>El formato del email es incorrecto</p>}
        </div>
        <div className='mb-4'>
          <label className='label-contact'>Contraseña:*</label>
          <input className='form-control my-2' type="password" onChange={(e) => setPassword(e.target.value)} {...register('password', {
            required: true,
            minLength: {
              value: 6,
            }
          })} />
          {errors.password?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo contraseña es requerido</p>}
          {errors.password?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>La contraseña debe tener al menos 6 letras</p>}
        </div>
        {/** <div className='mb-4'>
          <a className='text-white' href='#olvido'>¿Olvido su contraseña?</a>
        </div>*/}
        <div className='d-flex justify-content-between'>
          <Button type="submit" className='login-button'>Logearte</Button>
        </div>
        <hr />
        <p className='text-center label-contact'>
          Logeate con tus redes sociales
        </p>
        <div className='d-flex flex-row mb-3 justify-content-center social-media'>
          {/** <Button className='social-icon facebook'>
            <FaFacebookF />
          </Button>*/}
          <Button onClick={handleClick} className='social-icon google'>
            <FaGoogle />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormLogin