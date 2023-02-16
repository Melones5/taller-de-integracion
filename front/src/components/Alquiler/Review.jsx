import React from 'react'
import { useState, useEffect, Fragment } from "react";
import { FaStar } from "react-icons/fa";
import './Review.css';

import { useForm } from "react-hook-form";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { UserAuth } from '../../context/userContext'

import { Container, Row, Col, Button } from 'react-bootstrap';
import { async } from '@firebase/util';

const Review = () => {

  const { id_producto } = useParams();  
  const navigate = useNavigate();
  const { user } = UserAuth();

  const [items, setItems] = useState([]);

  const [valoracion, setValoracion] = useState(null);
  const [fecha, setFecha] = useState('');
  const [comentario, setComentario] = useState('');
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');

  const [hover, setHover] = useState(null);


  /**Obtengo fecha actual y para mandarla a la bd postgresql */
  let hoy = new Date();
  let dia = hoy.getDate()
  let mes = hoy.getMonth() + 1
  let agnio = hoy.getFullYear();
  let formato = `${agnio}-${mes}-${dia}`  

  const { register, handleSubmit, formState: { errors } } = useForm(
    {
      defaultValues: {
        valoracion: '',
        fecha: '',
        comentario: '',
        cliente: '',
        producto: '',
      }
    });

  useEffect(() => {
    const getProducto = async (id_producto) => {
      const response = await axios.get(`http://localhost:5000/producto/${id_producto}`)
      if (response.status === 200) {
        setItems(response.data)        
      }
    }
    getProducto(id_producto)
  }, [])

  const onSubmit = async (data, e) => {
    e.preventDefault();    
    data.producto = id_producto;
    data.cliente = user.email;
    data.fecha = formato;    
    try {
      axios.post('http://localhost:5000/review', data)
      Swal.fire({
        position: 'center',
        width: '32em',
        color: '#fff',
        background: '#5a72d1',
        icon: 'success',
        iconColor: '#fff',
        title: 'Review insertada  de manera correcta',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
      navigate('/productos_alquilados')
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
    }
  }

  return (
    <div className='py-5'>
      <Container>
        <Row className='justify-content-center'>
          <Col xs={12} lg={6} className='py-5'>
            <div className='form-container-review'>
              {items.map((item) => (
                <Fragment key={item.id_producto}>
                  <img src={item.urlfoto} alt="" className='m-auto mb-3 d-block img-thumbnail img-table reviewImg' />
                </Fragment>
              ))}
              <h2 className='pt-5 form-h1-review'>¿Qué te pareció el producto?</h2>
              {items.map((item) => (
                <Fragment key={item.id_producto}>
                  <h3 className='form-h2-review'>{item.nombre_producto}</h3>
                </Fragment>
              ))}
              <div className='py-3'>
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  <div className='mb-4'>
                    <div className='d-flex justify-content-center'>
                      {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                          <Fragment key={i}>
                            <label>
                              <input
                                type='radio'
                                name='rating'
                                value={ratingValue}
                                onClick={() => setValoracion(ratingValue)}
                                onChange={(e) => setValoracion(ratingValue)} {...register('valoracion', {
                                  required: true,
                                })}
                              />
                              <FaStar
                                className='star'
                                size={24}
                                color={ratingValue <= (hover || valoracion) ? "#ffc107" : "#e4e5e9"}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                              />
                            </label>
                          </Fragment>
                        )
                      })}
                    </div>
                    {errors.valoracion?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo valoracion es requerido</p>}
                  </div>
                </form>
              </div>
            </div>
            <div className='py-3'>
              <form autoComplete="off" className='form-container-review' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                  <h1 className='form-h1-review'>Agregá un comentario</h1>
                  <h2 className='form-h2-review'>(opcional)</h2>
                  <div className="form-outline">
                    <textarea className="form-control my-2" id="textoDescripcion" rows="6" type="text" onChange={(e) => setComentario(e.target.value)} {...register('comentario', {
                      maxLength: 255
                    })}
                      placeholder='Ej: "El producto cumplió mis expectativas..."'
                    >
                    </textarea>
                    {/** {errors.comentario?.type === 'required' && <p className='text-danger text-small d-block mb-2'>El campo comentario es requerido</p>}
                    {errors.comentario?.type === 'minLength' && <p className='text-danger text-small d-block mb-2'>El campo comentario debe tener al menos 4 letras</p>}*/}
                    {errors.comentario?.type === 'maxLength' && <p className='text-danger text-small d-block mb-2'>El campo comentario debe tener menos 255 letras</p>}
                  </div>
                </div>
                <div className='mb-4 d-flex justify-content-center'>
                  <button className='btn register-button my-2'>Enviar</button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Review