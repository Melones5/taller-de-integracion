/*Creación de tablas*/
﻿create table cliente(
	id_cliente SERIAL not null,
	uuid VARCHAR(100) unique,
	nombre varchar(30),
	apellido varchar(30),
	direccion varchar(50),
	telefono VARCHAR(30),
	email varchar(55) not null unique,
	password varchar (30),
	rol varchar (20) not null,
	constraint nombre_rol check (rol in
	('ARRENDADOR','PROPIETARIO')),
	constraint pk_email primary key (email)
);

create table categoria(
	id_categoria serial not null,
	categoria varchar(30) not null unique,
	constraint nombre_categoria check (categoria in('PLAYA','CAMPING','DEPORTIVOS','HERRAMIENTAS')),
	constraint pk_id_categoria primary key (id_categoria)
);

create table producto(
	id_producto serial not null,
	nombre_producto varchar(50) not null,
	precio float not null check (precio>0),
	descripcion_producto varchar(255) not null,
	cantidad integer not null check (cantidad>=0),
	estado varchar(15) not null,
	urlfoto varchar(2083),
	valoracion integer not null check(valoracion in (0,1,2,3,4,5)) default 0,
	categoria serial not null,
	cliente varchar(55) not null,
	constraint pk_id_producto primary key (id_producto),
	constraint fk_id_categoria foreign key (categoria) references categoria(id_categoria),
	constraint fk_email foreign key (cliente) references cliente(email) ON DELETE CASCADE
);

create table alquiler(
	id_alquiler serial not null,
	fecha_inicio_alquiler date not null,
	fecha_fin_alquiler date not null,	
	total float not null check (total>0),
	cliente varchar(55) not null,
	propietario varchar(55) not null,
	check (fecha_fin_alquiler >= fecha_inicio_alquiler),
	constraint pk_id_alquiler primary key (id_alquiler),
	constraint fk_email foreign key (cliente) references cliente(email),
	constraint fk_email_propietario foreign key (propietario) references cliente(email)	
);

create table carrito(
	id_carrito serial not null,
	alquiler serial not null,
	producto serial not null,	
	cantidad integer not null check (cantidad>0),
	precio float not null check (precio>0),
	constraint pk_id_carrito primary key (id_carrito),
	constraint fk_id_alquiler foreign key (alquiler) references alquiler(id_alquiler) ON DELETE CASCADE,
	constraint fk_id_producto foreign key (producto) references producto(id_producto) ON DELETE CASCADE
);

create table pago (
	id_pago serial not null,
	id_mercadopago bigserial not null,
	estado_pago boolean default false,
	tipoPago varchar(55) not null,
	alquiler serial not null,
	constraint pk_id_pago primary key (id_pago),
	constraint fk_id_alquiler foreign key (alquiler) references alquiler(id_alquiler) ON DELETE CASCADE
);

create table valoracion(
	id_valoracion serial not null,
	valoracion integer not null check (valoracion in (1,2,3,4,5)),
	fecha date not null,
	comentario varchar(255),
	cliente varchar(55) not null,
	producto serial not null,
	constraint pk_id_valoracion primary key (id_valoracion),
	constraint fk_email foreign key (cliente) references cliente(email) ON DELETE CASCADE,
	constraint fk_id_producto foreign key (producto) references producto(id_producto) ON DELETE CASCADE
);

create table extensionAlquiler(
	id_extension serial not null,
	alquiler serial not null,
	fecha_inicio_extension date not null,
	fecha_fin_extension date not null,
	totalExt float not null check (totalExt>0),
	check (fecha_fin_extension >= fecha_inicio_extension),
	constraint pk_id_extension primary key (id_extension),
	constraint fk_id_alquiler foreign key (alquiler) references alquiler(id_alquiler) ON DELETE CASCADE
);

drop table extensionAlquiler;

/*----------------------------------------------- TRIGGERS DE PRUEBA ----------------------------------------------------------------*/

-- Actualizar stock luego de realizar alquiler

CREATE OR REPLACE FUNCTION trigger_stock() RETURNS TRIGGER AS $funcemp$
BEGIN
	UPDATE producto SET cantidad = cantidad - new.cantidad WHERE id_producto = new.producto;
RETURN NEW;
END;
$funcemp$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stock AFTER INSERT ON carrito
FOR each row execute procedure trigger_stock()

-- Actualizar stock luego de devolver/cancelar alquiler
CREATE OR REPLACE FUNCTION trigger_cancelar_alquiler() RETURNS TRIGGER AS $funcemp$
BEGIN
	UPDATE producto SET cantidad = cantidad + OLD.cantidad WHERE id_producto = OLD.producto;
RETURN NEW;
END;
$funcemp$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cancelar_alquiler AFTER DELETE ON carrito
FOR each row execute procedure trigger_cancelar_alquiler()

-- Actualizar valoración del cliente sobre el producto
CREATE OR REPLACE FUNCTION trigger_actualizar_valoracion() RETURNS TRIGGER AS $funcemp$
DECLARE 
	promedio float;
	valo integer;
BEGIN
	promedio:= (SELECT avg(valoracion) FROM valoracion WHERE producto = NEW.producto);
	valo:= CAST ((SELECT ROUND(promedio)) AS integer);
	UPDATE producto SET valoracion = valo WHERE id_producto = NEW.producto;
RETURN NEW;
END;
$funcemp$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_valoracion AFTER INSERT OR UPDATE ON valoracion
FOR each row execute procedure trigger_actualizar_valoracion()

-- Actualizar rol del cliente después de agregar un producto
CREATE OR REPLACE FUNCTION trigger_actualizar_rol() RETURNS TRIGGER AS $funcemp$
DECLARE 
	r varchar(20):='PROPIETARIO';
BEGIN	
	UPDATE cliente SET rol = r WHERE email = NEW.cliente;
RETURN NEW;
END;
$funcemp$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_rol AFTER INSERT ON producto
FOR each row execute procedure trigger_actualizar_rol()

-- Actualizar fecha alquiler del cliente después de agregar un extensión de alquiler
CREATE OR REPLACE FUNCTION trigger_actualizar_fecha() RETURNS TRIGGER AS $funcemp$
DECLARE 
BEGIN	
	UPDATE alquiler SET fecha_fin_alquiler = NEW.fecha_fin_extension WHERE id_alquiler = NEW.alquiler;
RETURN NEW;
END;
$funcemp$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha AFTER INSERT OR UPDATE ON extensionAlquiler
FOR each row execute procedure trigger_actualizar_fecha()

-- Actualizar fecha alquiler y el total del cliente después de agregar un extensión de alquiler
CREATE OR REPLACE FUNCTION trigger_actualizar_fecha() RETURNS TRIGGER AS $funcemp$
DECLARE 
BEGIN	
	UPDATE alquiler SET fecha_fin_alquiler = NEW.fecha_fin_extension WHERE id_alquiler = NEW.alquiler;
	UPDATE alquiler SET total = total + NEW.totalExt WHERE id_alquiler = NEW.alquiler;

RETURN NEW;	
END;
$funcemp$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha AFTER INSERT OR UPDATE ON extensionAlquiler
FOR each row execute procedure trigger_actualizar_fecha()

DROP TRIGGER trigger_actualizar_fecha on extensionAlquiler

/*-------------------------------------------------- INSERTS NUEVOS ----------------------------------------------------*/

-- tener en cuenta ahora que se agregó la fk de cliente en los productos para tener quien publica que producto

--cliente---
insert into cliente (uuid, nombre, apellido, direccion, telefono, email, password, rol) 
values ('ce70282c-0a76-482e-996b-791a9b8534e8', 'Rental', 'store', 'pablo  163', '3442444444', 'rentalstoreapp@gmail.com', null, 'ARRENDADOR');

--categorias---
insert into categoria (categoria) values ('PLAYA');
insert into categoria (categoria) values ('CAMPING');
insert into categoria (categoria) values ('DEPORTIVOS');
insert into categoria (categoria) values ('HERRAMIENTAS');

--productos----
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, categoria, cliente) 
values ('Sombrilla Playa Playera', 150 , 'Sombrilla playera de excelente calidad, IDEAL para tus vacaciones.', 1,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_691068-MLA48754634335_012022-O.jpg', 1, 'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, categoria, cliente) 
values ('Carro Playero', 160 , 'carro playero de excelente calidad, IDEAL para tus vacaciones.', 1,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_810030-MLA49763165032_042022-O.webp', 1, 'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado,urlfoto,categoria, cliente) values 
('Carpa Camping Ottawa', 160 , 'Modelo: CNG 417 Ottawa IV, IDEAL para tus vacaciones.', 4,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_608040-MLA48923827009_012022-O.jpg',2,'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado,urlfoto,categoria, cliente) values 
('Carpa Tipo Iglu', 170 , 'Carpa Tipo Iglu, IDEAL para tus vacaciones.', 4,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_906727-MLA48024247326_102021-O.webp',2,'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado,urlfoto,categoria, cliente) values 
('Paleta de pádel', 160 , 'Esta paleta de pádel compuesta por soft eva te permitirá conseguir una mayor estabilidad, 
duplicando la capacidad de respuesta en todo tipo de golpes.', 4,'perfecto estado', 'https://http2.mlstatic.com/D_NQ_NP_812253-MLA48995446364_022022-O.jpg',3,'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado,urlfoto,categoria, cliente) values 
('Pelota Voley Pintier', 180 , 'Esta Pelota Voley Pintier compuesta por soft eva te permitirá conseguir una mayor estabilidad', 4,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_723512-MLA45534854019_042021-O.webp',3,'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, categoria, cliente) values 
('Taladro percutor inalámbrico', 260 , 'Con el taladro eléctrico Lüsqtoff ATL18-8B podrás realizar múltiples tareas en diversas superficies de un modo práctico y sencillo.', 4,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_923962-MLA44666427411_012021-O.jpg',4, 'rentalstoreapp@gmail.com');
insert into producto (nombre_producto, precio, descripcion_producto, cantidad, estado, urlfoto, categoria, cliente) values 
('Amoladora angular Bosch', 360 , 'Con la Amoladora angular Bosch podrás realizar múltiples tareas en diversas superficies de un modo práctico y sencillo.', 4,'perfecto estado', 
'https://http2.mlstatic.com/D_NQ_NP_822677-MLA42398282026_062020-O.webp',4, 'rentalstoreapp@gmail.com');


--> Orden de ejecución de los scripts SQL para crear la BD
1.Creamos las tablas
2.Creamos los triggers
3.Insertamos los datos

/*----------------------------------------------------SELECTS DE PRUEBA------------------------------------------------------------*/
select * from cliente
select * from producto
select * from valoracion

-- consulta clientes que alquilaron a un propietario
-- me falta agregar el inner entre pago y alquiler (para ver si está pagado o no)

select alquiler.id_alquiler, alquiler.fecha_inicio_alquiler as fecha_ini, alquiler.fecha_fin_alquiler as fecha_fin, cliente.email, cliente.telefono, cliente.direccion, pago.estado_pago, carrito.id_carrito
from alquiler
inner join carrito on carrito.alquiler = alquiler.id_alquiler
inner join producto on carrito.producto = producto.id_producto
inner join cliente on cliente.email = alquiler.cliente
inner join pago on pago.alquiler = alquiler.id_alquiler
where alquiler.propietario = 'rentalstoreapp@gmail.com'
Group by alquiler.id_alquiler, fecha_ini, fecha_fin, cliente.email, cliente.telefono, cliente.direccion, pago.estado_pago, carrito.id_carrito order by carrito.id_carrito

--Esta extensión sirve para que acepte postgresql uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";