import React, { Fragment, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import axios from 'axios';

//datatable prueba
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext';


import Swal from 'sweetalert2'


import { UserAuth } from '../../context/userContext'

function AlquilerDetail() {

  let navigate = useNavigate();

  const { id_alquiler } = useParams();

  const { user } = UserAuth();  

  const [items, setItems] = useState([]);

  useEffect(() => {
    const getAlquiler = async (id_alquiler) => {
      const response = await axios.get(`http://localhost:5000/carrito/${id_alquiler}`)
      if (response.status === 200) {
        setItems(response.data)        
      }
    }
    getAlquiler(id_alquiler)
  }, [])

  //FILTRO DE LA TABLA
  const [filtro, setFiltro] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filtro = { ...filtro };
    _filtro['global'].value = value;
    setFiltro(_filtro);
    setGlobalFilterValue1(value)
  }

  //Función para cancelar un alquiler
  function deleteAlquiler(id_alquiler) {  
    try {
      if (user) {
        Swal.fire({
          title: 'Devolver alquiler',
          text: "¿Estás seguro que querés devolver este alquiler?",
          icon: 'warning',
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
              title: 'Cancelado',
              text: "Cancelado correctamente",
              icon: 'success',
              color: '#fff',
              confirmButtonColor: '#050A30',
              background: '#5a72d1'
            })
            //axios.post(`http://localhost:5000/devolucion/${id_alquiler}`) ver si sería necesaria la tabla devolución.           
            axios.delete(`http://localhost:5000/alquiler/${id_alquiler}`)
            navigate('/productos_alquilados')            
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
        title: 'Error al cancelar este alquiler',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500
      })
    }
  }

  //HEADER DE LA TABLA CON EL SEARCH
  const renderHeader1 = () => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={'/productos_alquilados'} style={{ textDecoration: "none" }} >
            <Button icon="pi pi-arrow-left" className="p-button-sm p-button-success" label='Volver'></Button>
          </Link>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar producto... " />
          </span>
          {/** <Button icon="pi pi-shopping-bag" className="p-button-sm p-button-info" onClick={() => deleteAlquiler(id_alquiler)} label='Devolver'></Button>*/}
        </div>
      </>
    )
  }
  const header1 = renderHeader1();



  //TEMPLATE DE LOS BOTONES EN LA TABLA
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <div className="p-grid p-formgrid p-fluid">
          <div className="p-mb-2 p-lg-1 p-mb-lg-0 pb-1">
            <Link to={`/review/${rowData.id_producto}`} style={{ textDecoration: "none" }} >
              <Button icon="pi pi-star" className='p-button-warning p-button-sm' label='Valorar'></Button>
            </Link>
          </div>
          <div className="p-mb-2 p-lg-1 p-mb-lg-0">
            {/**<Button label='Contactar' icon="pi pi-envelope" className='p-button-succes' onClick={() => deleteAlquiler(rowData.id_alquiler)}></Button>*/}
          </div>
        </div>
      </>
    )
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.urlfoto} alt={rowData.urlfoto} width="50" height="50" className='mx-auto d-block img-thumbnail img-table' />
  }

  const totalBodyTemplate = (rowData) => {
    return <>{rowData.cantidad * rowData.precio}</>
  }
  
  return (
    <div className='py-5'>
      <Container>
        {/** 
        <Table striped bordered hover variant="light" responsive className='caption-top align-middle'>
          <caption>Alquileres</caption>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Prec.Unitario</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Dueño</th>
              <th>Teléfono</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id_alquiler}>
                <td>{item.id_alquiler}</td>
                <td>
                  <img src={item.urlfoto} width="50" height="50" className='mx-auto d-block img-thumbnail img-table' alt="" />
                </td>
                <td>{item.nombre_producto}</td>
                <td>{item.precio}</td>
                <td>{item.cantidad}</td>
                <td>{item.cantidad * item.precio}</td>
                <td>{item.cliente}</td>
                <td>{item.telefono}</td>
                <Col className='d-flex align-items-start justify-content-center' xs={12}>
                  <Link style={{ textDecoration: "none" }} >
                    <td> <button> Valorar <i className="fa-solid fa-plus"></i></button></td>
                  </Link>
                  <td> <button> Correo <i className="fa-solid fa-ban"></i></button></td>
                </Col>
              </tr>
            ))}
          </tbody>
        </Table>*/}
        <DataTable
          value={items}
          header={header1}
          size="small"
          filters={filtro}
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          dataKey='id_carrito'
          paginator
          emptyMessage="No hay productos para mostrar"
          className='datatable-reponsive'
          currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords} Productos alquilados'
          rows={5}
        >
          <Column field="id_carrito" sortable header="ID"></Column>
          <Column body={imageBodyTemplate} field="urlfoto" header="IMAGEN"></Column>
          <Column field="nombre_producto" sortable header="NOMBRE"></Column>
          <Column field="precio" sortable header="PRECIO UNITARIO"></Column>
          <Column field="cantidad" sortable header="CANTIDAD"></Column>
          {/**<Column body={totalBodyTemplate} header="TOTAL"></Column>*/}
          <Column field="cliente" header="DUEÑO"></Column>
          <Column field="telefono" header="TELÉFONO"></Column>
          <Column header="OPCIONES" body={actionBodyTemplate}></Column>
        </DataTable>
      </Container>
    </div>
  )
}

export default AlquilerDetail
