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
