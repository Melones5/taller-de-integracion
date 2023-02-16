import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//importamos los diferentes componentes para las routes
import Header from './components/Header/Header.jsx';
import Home from './components/Header/Home';
import Contact from './components/Header/Contact';
import Login from './components/Header/Login';
import LoginSocial from './components/LoginSocial.jsx';
import Account from './components/User/Account.jsx';
import ProductosAlquilados from './components/User/ProductosAlquilados';
import ProductosEnAlquiler from './components/User/ProductosEnAlquiler';
import ProductDetail from './components/Products/ProductDetail.jsx';
import AlquilerDetail from './components/Alquiler/AlquilerDetail.jsx';
import Review from './components/Alquiler/Review.jsx';
import EditProduct from './components/Products/EditProduct.jsx';
import Footer from './components/Footer/Footer.jsx';
import Cart from './components/Products/Cart.jsx';
import Error404 from './components/Error404.jsx';
import ContactEmail from './components/Header/ContactEmail.jsx';
import Ayuda from './components/Header/Ayuda.jsx';
import AlquileresActivos from './components/Alquiler/AlquileresActivos.jsx';
import AlquileresActivosDetail from './components/Alquiler/AlquileresActivosDetail.jsx';
import FailurePage from './components/BackUrls/FailurePage.jsx';
import SuccessPage from './components/BackUrls/SuccessPage.jsx';
import AlquilerExtend from './components/Alquiler/AlquilerExtend.jsx';


//Provider y protected route
import { CartProvider } from './context/CartContext';
import { AuthContextProvider } from './context/userContext';
import ProtectecRoute from './components/ProtectecRoute.js';

//lleva siempre el focus al top de la página
import ScrollToTop from './helpers/ScrollToTop';


function App() {
  return (
    <AuthContextProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main className='py-3'>
            <Container>
              <Routes>
                <Route path="/" exact element={<Home />} />
                 {/*<Route path="/contact" exact element={<Contact />} />*/}
                <Route path="/contactv2" exact element={<ContactEmail />} />
                <Route path='/help' exact element={<Ayuda />}/>
                <Route path="/login" exact element={<Login />} />

                {/* Acá agregué el detalle del producto a ver si anda */}
                <Route path='/product-detail/:id_producto' exact element={<ProductDetail />} />

                {/** <Route path="/loginsocial" exact element={ <LoginSocial />} />*/}

                {/* rutas protegidas */}
                <Route path="/account" exact element={
                  <ProtectecRoute>
                    <Account />
                  </ProtectecRoute>}
                />

                <Route path='/productos_alquiler' exact element={
                  <ProtectecRoute>
                    <ProductosEnAlquiler />
                  </ProtectecRoute>
                }
                />
                <Route path='/alquileres-activos/:email' exact element={
                  <ProtectecRoute>
                    <AlquileresActivos />
                  </ProtectecRoute>
                }
                />
                <Route path='/alquileres-activos-detail/:id_alquiler' exact element={
                  <ProtectecRoute>
                    <AlquileresActivosDetail />
                  </ProtectecRoute>
                }
                />
                <Route path="/contact-cliente" exact element={
                  <ProtectecRoute>
                    <Contact />
                  </ProtectecRoute>
                } 
                />
                <Route path='edit-product/:id_producto' exact element={
                  <ProtectecRoute>
                    <EditProduct />
                  </ProtectecRoute>
                } />
                <Route path='/productos_alquilados' exact element={
                  <ProtectecRoute>
                    <ProductosAlquilados />
                  </ProtectecRoute>
                }
                />
                <Route path='/alquiler-detail/:id_alquiler' exact element={
                  <ProtectecRoute>
                    <AlquilerDetail />
                  </ProtectecRoute>
                } 
                />

                <Route path='/alquiler-extend/:id_alquiler' exact element={
                  <ProtectecRoute>
                    <AlquilerExtend />
                  </ProtectecRoute>
                } 
                />

                <Route path='/review/:id_producto' exact element={
                  <ProtectecRoute>                    
                    <Review />
                  </ProtectecRoute>
                } 
                />

                <Route path="/cart" exact element={
                  <ProtectecRoute>
                    <Cart />
                  </ProtectecRoute>
                }
                />
                <Route path="*" element={<Error404 />} />
                <Route path='/failure' element={<FailurePage/>}/>
                <Route path='/success' element={<SuccessPage/>}/>
              </Routes>
            </Container>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthContextProvider>
  );
}

export default App;
