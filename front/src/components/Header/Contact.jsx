import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import axios from 'axios';
import './Contact.css';
import imgContact from '../../assets/contactuser.svg'

const Contact = () => {

  const [email, setEmail] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')

  const navigate = useNavigate();


  const { register, handleSubmit, watch, formState: { errors } } = useForm(
    {
      defaultValues: {                                        
        email: '',
        asunto: '',
        mensaje: '',
      }
  });


  const onSubmit = (data, e) => {
    e.preventDefault();   
    try {
      axios.post('http://localhost:5000/mail', data)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#5a72d1',
        icon: 'success',
        iconColor: '#fff',
        title: 'Correo enviado de manera correcta al cliente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      navigate('/productos_alquiler')
    } catch (error) {
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#f93333',
        icon: 'error',
        iconColor: '#fff',
        title: 'Error al agregar review.',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })      
     //console.log(error.message)      
    }
  }

  return (
    <Container className='py-5'>
      <Row>
        <Col xs={12} lg={6} className='d-flex justify-contenct-center py-5'>
          <img src={imgContact} style={{width: '100%'}} alt="imagen contacto" />
        </Col>
        <Col xs={12} lg={6}>
          <h1 className='text-left h1-contact'> Contáctense </h1>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
           
            <div className='mb-4'>
              <label className='label-contact'>Email*</label>
              <input className='form-control my-2' type="text" onChange={(e) => setEmail(e.target.value)} {...register('email', {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
              })} />
              {errors.email?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo email es requerido</p>}
              {errors.email?.type === 'pattern' && <p className='text-danger text-small d-block mb-2'>El formato del email es incorrecto</p>}
            </div>

            <div className='mb-4'>
              <label className='label-contact'>Asunto*</label>
              <input className='form-control my-2' type="text" onChange={(e) => setAsunto(e.target.value)}{...register('asunto', {
                required: true,
                maxLength: 30
              })} />
              {errors.asunto?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo asunto es requerido</p>}
              {errors.asunto?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo nombre debe tener menos de 30 caracteres</p>}
            </div>

            <div className='mb-4'>
              <label className='label-contact'>Mensaje*</label>
              <div className="form-outline">
                <textarea className="form-control my-2" id="textoMensaje" rows="4" type="text" onChange={(e) => setMensaje(e.target.value)} {...register('mensaje', {
                  required: true,
                })}>
                </textarea>
                {errors.mensaje?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo mensaje es requerido</p>}
              </div>
            </div>
            <div className='mb-4'>
              <button className='btn contact-button my-2'>Contactar</button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default Contact