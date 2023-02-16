/*Tablas viejas*/
create table alquiler(
	id_alquiler integer not null,
	fecha_inicio_alquiler date not null,
	fecha_fin_alquiler date not null,
	fecha_devolucion_alquiler date not null,
	primary key (id_alquiler)
);

create table carrito(
	id_carrito integer not null,
	id_producto integer[] not null,
	id_alquiler integer not null,
	total_carrito int not null,
	primary key (id_carrito),
	foreign key (id_carrito) REFERENCES producto(id_producto),
	foreign key (id_carrito) REFERENCES alquiler(id_alquiler)
);


create table devolucion(
	id_devolucion integer not null,
	id_alquiler integer not null,
	estado_devolucion varchar(40) not null,
	calificacion integer not null,
	primary key (id_devolucion),
	foreign key(id_devolucion) REFERENCES alquiler(id_alquiler)
);

create table pago(
	id_pago integer not null,
	id_carrito integer not null,
	estado_pago boolean not null,
	primary key(id_pago),
	foreign key(id_pago) REFERENCES carrito(id_carrito)
);

create table extensionAlquiler(
	id_extension integer not null,
	id_alquiler integer not null,
	fecha_inicion_extension date not null,
	fecha_fin_extension date not null,
	primary key(id_extension),
	foreign key(id_extension) REFERENCES alquiler(id_alquiler)
);


-- VERSIÓN VIEJA DE LA ALQUILER CON CASCADA

create table alquiler(
	id_alquiler serial not null,
	fecha_inicio_alquiler date not null,
	fecha_fin_alquiler date not null,	
	total float not null check (total>0),
	cliente varchar(55) not null,
	propietario varchar(55) not null,
	check (fecha_fin_alquiler >= fecha_inicio_alquiler),
	constraint pk_id_alquiler primary key (id_alquiler),
	constraint fk_email foreign key (cliente) references cliente(email) ON DELETE CASCADE,
	constraint fk_email_propietario foreign key (propietario) references cliente(email) ON DELETE CASCADE	
);
--no está más la tabla ROL lo puse como atributo del cliente que cambia después de agregar un producto.
INSERT INTO rol VALUES (DEFAULT, 'ARRENDADOR');
INSERT INTO rol VALUES (DEFAULT, 'PROPIETARIO');