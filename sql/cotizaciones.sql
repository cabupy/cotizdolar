-- Table: public.cotizaciones

-- DROP TABLE public.cotizaciones;

CREATE TABLE public.cotizaciones
(
    id biserial NOT NULL,
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