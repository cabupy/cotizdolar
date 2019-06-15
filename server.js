const http = require("http");
const bodyParser = require("body-parser");
const volleyball = require("volleyball");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();
const app = require("express")();
const routes = require("./routes");

app.set("trust proxy", true);
app.set("strict routing", true);
app.set("case sensitive routing", true);
app.set("x-powered-by", false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    methods: ["HEAD", "OPTIONS", "GET", "POST"],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false
  })
);
app.use(volleyball);
app.use((req, res, next) => {
  res.header("X-Powered-By", "Vamyal S.A. <vamyal.com>");
  res.header(
    "X-Hello-Human",
    "Somos Vamyal, Escribinos a <contacto@vamyal.com>"
  );
  next();
});

// Cargamos las rutas habilitadas.
app.use("/v1", routes);

app.use("*", function(req, res, next) {
  res.status(200).json({
    success: true,
    message: `Vamyal S.A. 2019 ! -  API para CONSULTAR COTIZACIONES - PY`
  });
  next();
});

const ip = process.env.IP;
const port = process.env.PORT;

console.time("Arrancamos el server en");
var server = http.createServer(app).listen(port, ip, function() {
  console.log(
    `Cotizaciones PY API en http://${server.address().address}:${
      server.address().port
    }`
  );
});

process.on("unhandledRejection", (reason, p) => {
  console.log(`Unhandled Rejection at: ${p} reason: ${reason}`);
  process.exit(1);
});

process.on("uncaughtException", err => {
  console.error(`Caught exception: ${err}\n`);
  process.exit(1);
});
