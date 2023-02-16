import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment'
//datatable prueba
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

/**
primereact/resources/themes/viva-light/theme.css
primereact/resources/themes/saga-blue/theme.css
primereact/resources/themes/rhea/theme.css
*/


import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext';

const AlquileresActivos = () => {

  const { email } = useParams();

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
    cargarAlquileresProductos()
  }, [])

  //función que carga los alquileres activos de un determinado propietario
  const cargarAlquileresProductos = async () => {
    const response = await axios.get(`http://localhost:5000/alquiler/alquileres-activos/${email}`)
    if (response.status === 200) {
      setAlquiler(response.data)      
    }
  }

  //HEADER DE LA TABLA CON EL SEARCH
  const renderHeader1 = () => {
    return (
      <div >
        <Container>
          <Row>
            <Col className=' d-flex justify-content-left align-items-center'>
              <Link to={'/productos_alquiler'} style={{ textDecoration: "none" }} >
                <Button icon="pi pi-arrow-left" className="p-button-sm p-button-success" label='Volver'></Button>
              </Link>
            </Col>
            <Col className='pt-2 d-flex justify-content-end align-items-center'>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar alquiler... " />
              </span>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  const header1 = renderHeader1();

  //TEMPLATE DE LOS BOTONES EN LA TABLA
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <div className="p-grid p-formgrid p-fluid">
          <div className="p-mb-2 p-lg-1 p-mb-lg-0 pb-1">
            <Link to={`/alquileres-activos-detail/${rowData.id_alquiler}`} style={{ textDecoration: "none" }} >
              <Button icon="pi pi-plus" className='p-button-success p-button-sm' label='Ver más'></Button>
            </Link>
          </div>          
            <div className="p-mb-2 p-lg-1 p-mb-lg-0">
              <Link to={'/contact-cliente'} style={{ textDecoration: "none" }} >
                <Button label='Contactar' icon="pi pi-envelope" className='p-button-succes p-button-sm'></Button>
              </Link>
            </div>          
        </div>
      </>
    )
  };

  // Formateo de fechas para tabla
  const dateIni = (rowData) => {
    return <div>{moment(rowData.fecha_ini).format('DD/MM/yyyy')}</div>
  }
  const dateFin = (rowData) => {
    return <div>{moment(rowData.fecha_fin).format('DD/MM/yyyy')}</div>
  }

  // formateo de estado de pago
  const truePago = (rowData) =>{     
    if (typeof rowData.estado_pago === "boolean") {
      return rowData.estado_pago ? "Pagado" : "No pagado";
    } else {
      return rowData.estado_pago;
    }
  }


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
          emptyMessage="No hay alquileres activos para mostrar"
          className='datatable-reponsive'
          currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords} alquileres'
          rows={5}
        >
          <Column field="id_alquiler" sortable header="ID"></Column>
          <Column body={dateIni} field="fecha_inicio_alquiler" sortable header="FECHA INICIO"></Column>
          <Column body={dateFin} field="fecha_fin_alquiler" sortable header="FECHA FIN"></Column>
          <Column field="direccion" header="DIRECCIÓN"></Column>
          <Column field="email" header="USUARIO"></Column>
          <Column field="telefono" header="TELÉFONO"></Column>
          <Column body={truePago} field="estado_pago" header="ESTADO DE PAGO"></Column>
          <Column header="OPCIONES" body={actionBodyTemplate}></Column>          
        </DataTable>
      </Container>
    </div>
  )
}

export default AlquileresActivos
