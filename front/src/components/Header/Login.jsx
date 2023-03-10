import React from 'react'
import FormLogin from '../Formulario/FormLogin'
import FormRegister from '../Formulario/FormRegister'
import { Container, Row, Col } from 'react-bootstrap'


const Login = () => {
  return (
    <>
      <Container className='py-5'>
        <Row>
          <Col xs={12} md={8} lg={6}>          
          <FormLogin />
          </Col>
          <Col xs={12} md={8} lg={6}>
            <FormRegister />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Login