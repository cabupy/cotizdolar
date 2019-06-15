const router = require("express").Router();
const Cotizaciones = require("./cotizaciones");

router.use("/cotizaciones", Cotizaciones);

module.exports = router;
