import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'

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


const AlquileresActivosDetail = () => {

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

  //HEADER DE LA TABLA CON EL SEARCH
  const renderHeader1 = () => {
    return (
      <>
        <Container>
          <Row>
            <Col className=' d-flex justify-content-left align-items-center'>
              <Link to={`/alquileres-activos/${user.email}`} style={{ textDecoration: "none" }} >
                <Button icon="pi pi-arrow-left" className="p-button-sm p-button-success" label='Volver'></Button>
              </Link>
            </Col>
            <Col className='pt-2 d-flex justify-content-end align-items-center'>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar producto... " />
              </span>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
  const header1 = renderHeader1();


  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.urlfoto} alt={rowData.urlfoto} width="50" height="50" className='mx-auto d-block img-thumbnail img-table' />
  }

  const totalBodyTemplate = (rowData) => {
    return <>{rowData.cantidad * rowData.precio}</>
  }


  return (
    <div className='py-5'>
      <Container>
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
        </DataTable>
      </Container>
    </div>
  )
}

export default AlquileresActivosDetail