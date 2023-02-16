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