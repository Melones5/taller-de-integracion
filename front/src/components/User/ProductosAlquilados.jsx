import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import moment from 'moment'

import { UserAuth } from '../../context/userContext'
import axios from 'axios';
import { getAlquilerCliente } from '../../services/funciones';

//datatable prueba
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext';



const ProductosAlquilados = () => {

  //USUARIO-NAVIGATE-ALQUILERES
  const { user } = UserAuth();
  let navigate = useNavigate();
  const [alquiler, setAlquiler] = useState([]);

 
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

  useEffect(() => {    
    cargarAlquileres()
  }, [user])

  //función que carga los alquileres de un determinado cliente
  const cargarAlquileres = async () => {
    const response = await getAlquilerCliente(user.email)
    if (response.status === 200) {
      setAlquiler(response.data)      
    }
  }

  //Función para cancelar un alquiler
  function deleteAlquiler(id_alquiler) {    
    try {
      if (user) {
        Swal.fire({
          title: 'Cancelar alquiler',
          text: "¿Estás seguro que querés cancelar este alquiler?",
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
            axios.delete(`http://localhost:5000/alquiler/${id_alquiler}`)
            setAlquiler(alquiler.filter(alquiler => alquiler.id_alquiler !== id_alquiler))
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

  //TEMPLATE DE LOS BOTONES EN LA TABLA
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <div className="p-grid p-formgrid p-fluid">
          <div className="p-mb-2 p-lg-1 p-mb-lg-0 pb-1">
            <Link to={`/alquiler-detail/${rowData.id_alquiler}`} style={{ textDecoration: "none" }} >
              <Button icon="pi pi-plus" className='p-button-success p-button-sm' label='Ver más'></Button>
            </Link>
          </div>
          <div className="p-mb-2 p-lg-1 p-mb-lg-0 pb-1">
            <Link to={`/alquiler-extend/${rowData.id_alquiler}`} style={{ textDecoration: "none" }} >
              <Button icon="pi pi-calendar-plus" className='p-button-warning p-button-sm' label='Extender'></Button>
            </Link>
          </div>
          <div className="p-mb-2 p-lg-1 p-mb-lg-0">
            <Button label='Cancelar' icon="pi pi-times" className='p-button-danger p-button-sm' onClick={() => deleteAlquiler(rowData.id_alquiler)}></Button>
          </div>          
        </div>
      </>
    )
  };

  // Formateo de fechas para tabla
  const dateIni = (rowData) => {
    return <div>{moment(rowData.fecha_inicio_alquiler).format('DD/MM/yyyy')}</div>
  }
  const dateFin = (rowData) => {
    return <div>{moment(rowData.fecha_fin_alquiler).format('DD/MM/yyyy')}</div>
  }

  //HEADER DE LA TABLA CON EL SEARCH
  const renderHeader1 = () => {
    return (
      <div className="d-flex justify-content-center align-items-center">               
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar alquiler... " />
        </span>
      </div>
    )
  }
  const header1 = renderHeader1();


  return (
    <div className='py-5'>
      {/**Prueba datatable */}
      <Container>
        <DataTable
          value={alquiler}
          header={header1}
          size="small"
          filters={filtro}
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          dataKey='id_alquiler'
          paginator
          emptyMessage="No hay alquileres para mostrar"
          className='datatable-reponsive'
          currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords} alquileres'
          rows={5}
        >
          <Column field="id_alquiler" sortable header="ID"></Column>
          <Column body={dateIni} field="fecha_inicio_alquiler" sortable header="FECHA INICIO"></Column>
          <Column body={dateFin} field="fecha_fin_alquiler" sortable header="FECHA FIN"></Column>          
          <Column field="total" sortable header="TOTAL"></Column>
          <Column field="cliente" header="USUARIO"></Column>
          <Column header="OPCIONES" body={actionBodyTemplate}></Column>
        </DataTable>
      </Container>
    </div>
  )
}

export default ProductosAlquilados