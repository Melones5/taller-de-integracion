import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import fail from '../../assets/fail.png'

const FailurePage = () => {
  return (
    <div>      
      <Container>
            <Row>
                  <Col md={{ span: 6, offset: 3 }}className='text-center text-white'>
                        <img style={{width: '70%'}} src={fail} alt="fail" />
                        <h2 className='py-3'>Upsss... Algo salió mal :c</h2>
                        <Link to="/" className='cart-link'>Seguir Alquilando</Link>
                  </Col>
            </Row>
      </Container>
    </div>
  )
}

export default FailurePage