import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Ayuda = () => {
  return (
    <div className='py-3'>
      <Container>
        <Row className='d-flex justify-content-center aling-items-center'>
          <Col>
            <h2 className='text-center h1-contact text-white'>Denuncias en Defensa del Consumidor</h2>
            <div>
              <div className='p-text text-white'>
                Cualquier persona usuaria que tenga un problema con los servicios ofrecidos por <strong>Rental Store</strong> podrá iniciar un reclamo. Para hacerlo, tendrá que ingresar al apartado <strong>"Contacto"</strong> en la parte superior de la página y realizar la determinada denuncia seleccionando en asunto el tipo del mismo. Podrá contactar al dueño/cliente del producto para intentar solucionar el problema o incluso solicitar la intervención de <strong>Rental Store</strong>.
              </div>
              <div className='py-2 p-text text-white'>
                Para los alquileres en la plataforma de <strong>Rental Store</strong>, si la resolución de un reclamo no fuera satisfactoria, podrá continuar con el reclamo ante el Defensor del Cliente de Rental Store.
              </div>
              <div className='py-2 p-text text-white'>
                Además, siempre podrá hacer una denuncia en el Portal de Defensa de las y los Consumidores; y para residentes en la Ciudad de Concepción del Uruguay, podrá hacer una denuncia ante Defensa del Consumidor. Ante cualquier duda, siempre podrá consultar la Ley de Defensa del Consumidor.
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Ayuda