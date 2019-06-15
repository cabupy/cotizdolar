
# Cotización del Dólar

> Sistema que extrae de sitios web y APIs las cotizaciones del dolar
> las guarda en una tabla de una BD `PostgreSQL`, y luego cada X tiempo
> envia un `Tweet` ordenado por mejor venta, mejor compra y referencias 
> de la SET y BCP.

### Como se instala ?

```bash
$ git clone https://github.com/cabupy/cotizdolar.git
$ cd cotizdolar
$ npm install
```

### /config path

Es necesario crear una carpeta `/config` con un archivo dentro `index.js`.

```bash
$ cd cotizdolar
$ mkdir config
$ cd config
$ touch index.js
```

Agregar estas lineas al archivo `index.js`

```javascript
module.exports = {
  postgres : {
    database: 'cotizaciones',
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: 'postgres'
  }
}
```

### Database: cotizaciones

```sql
-- Database: cotizaciones

-- DROP DATABASE cotizaciones;

CREATE DATABASE cotizaciones
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

### Table: cotizaciones

El siguiente script `SQL` crea la tabla cotizaciones. 

```sql
-- Table: public.cotizaciones

-- DROP TABLE public.cotizaciones;

CREATE TABLE public.cotizaciones
(
    id bigserial NOT NULL,
    fecha_hora timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entidad character varying(20) NOT NULL,
    moneda character varying(20) NOT NULL,
    compra double precision NOT NULL DEFAULT 0.00,
    venta double precision NOT NULL DEFAULT 0.00,
    CONSTRAINT cotizaciones_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.cotizaciones
    OWNER to postgres;
```

### Archivos .js

- `crontab.js` es para configurar su ejecución desde el crontab del SO.
- `cronjobs.js` es para correr con node y usar la libreria cron.
- `server.js` levanta un `express` server para publicar una API.

### If you Fork repo cotizdolar.git

En caso de que hagan un `Fork` del repositorio, con estos pasos lo pueden
mantener actualizado. Y así tambien colaborar con el proyecto y enviar sus `PRs`. 

```bash
$ git remote add upstream https://github.com/cabupy/cotizdolar.git
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
$ git push
```

### Autor:

- `Cabu Vallejos`

### Licencia MIT: [Licencia](https://github.com/cabupy/cotizdolar/blob/master/LICENSE)

