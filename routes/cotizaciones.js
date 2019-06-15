const router = require("express").Router();
const db = require("../db");

const getBestBy = async field => {
  try {
    const rows = await db.query(`SELECT c.* FROM (
      SELECT DISTINCT ON (a.entidad) a.*
      FROM public.cotizaciones a
      INNER JOIN public.cotizaciones b ON a.id=b.id
      ORDER BY a.entidad, b.fecha_hora DESC) c
      ORDER BY ${field} ${field == "venta" ? "ASC" : "DESC"}`);
    return rows;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

router.get("/", async (req, res) => {
  try {
    const result = await getBestBy(`venta`);
    console.log(result.length);
    if (!result.length) {
      return res.status(404).json({ message: `No hay cotizaciones en la BD.` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(`Error: ${err}`);
    res
      .status(500)
      .json({ message: `Ocurrio un error al buscar cotizaciones.` });
  }
});

module.exports = router;
