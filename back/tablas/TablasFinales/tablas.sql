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