-- Como traer los registros mas nuevos de cada entidad
SELECT DISTINCT ON (a.entidad) a.*
FROM public.cotizaciones a
INNER JOIN public.cotizaciones b ON a.id=b.id
ORDER BY a.entidad, b.fecha_hora DESC

-- Como traer los registros con mejor venta
SELECT c.* FROM (
SELECT DISTINCT ON (a.entidad) a.*
FROM public.cotizaciones a
INNER JOIN public.cotizaciones b ON a.id=b.id
ORDER BY a.entidad, b.fecha_hora DESC) c
ORDER BY venta ASC

-- Como traer los registros con mejor compra
SELECT c.* FROM (
SELECT DISTINCT ON (a.entidad) a.*
FROM public.cotizaciones a
INNER JOIN public.cotizaciones b ON a.id=b.id
ORDER BY a.entidad, b.fecha_hora DESC) c
ORDER BY compra DESC