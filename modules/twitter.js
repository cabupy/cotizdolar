const path = require("path");
const Twit = require("twit");
const moment = require("moment");
// upload de env vars from .env file
require("dotenv").config({ path: path.join(__dirname, "/../.env") });
const db = require("../db");

const { processData } = require('./insertdb');

const ahora = moment(Date.now()).format("HH:mm");

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const getBestBy = async field => {
  try {
    const rows = await db.query(`SELECT c.* FROM (
      SELECT DISTINCT ON (a.entidad) a.*
      FROM public.cotizaciones a
      INNER JOIN public.cotizaciones b ON a.id=b.id
      ORDER BY a.entidad, b.fecha_hora DESC) c
      ORDER BY ${field} ${ field == 'venta' ? 'ASC' : 'DESC' }`);
    return rows;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const sendTweet = cadenaTweet => {
  return new Promise((resolve, reject) => {
    T.post(
      "statuses/update",
      { status: cadenaTweet },
      (err, data, response) => {
        if (err) {
          resolve({ success: false, err });
        }
        resolve({ success: true, id: data.id, created_at: data.created_at });
      }
    );
  });
};

const makeTextTweet = (rows, title) => {
  return new Promise((resolve, reject) => {
    let cadenaTweet = `${title}`;
    let referencia = ``
    rows.map((row, i) => {
      if (row.entidad == 'set' || row.entidad == 'bcp' ) {
        
        if (referencia == '') {
          referencia += `${row.compra} | ${row.venta} | ${row.entidad}\n`;
        } else {
          referencia += `${row.compra} | ${row.venta} | ${row.entidad}`;
        }
      
      } /*else if (rows.length == i + 1) {
        cadenaTweet += `${row.compra} | ${row.venta} | ${row.entidad}`;
      }*/ else {
        cadenaTweet += `${row.compra} | ${row.venta} | ${row.entidad}\n`;
      }
    });
    cadenaTweet += referencia;
    resolve(cadenaTweet);
  });
};

const processTweet = async mode => {
  let cadenaTweet = ``;
  try {
    const insertDB = await processData();
    if (!insertDB){
      console.log(`No se proceso correctamente el processData().`);
    }
    const rowsBS = await getBestBy(mode);
    if (rowsBS.length > 0) {
      cadenaTweet = await makeTextTweet(
        rowsBS,
        `${ahora} Orden Mejor ${capitalize(mode)}:\n`
      );
      // show string Teewt
      console.log(cadenaTweet);
      const envioTweet = await sendTweet(cadenaTweet);
      if (envioTweet.success) {
        console.log(
          `Se envio el tweet ID: ${envioTweet.id} en fecha: ${
            envioTweet.created_at
          }`
        );
      } else {
        console.error(
          `Ocurrio un error al enviar el Tweet. Error: ${
            envioTweet.err.message
          }`
        );
      }
    } else {
      console.log(`No hay nada que enviar.`);
    }
  } catch (error) {
    console.error(
      `Error al buscar la mejor cotizacion de venta: Error: ${error.message}`
    );
  }
};

// setTimeout(() => {
//   processTweet(`compra`);
// }, 5000);

// setTimeout(() => {
//   processTweet(`venta`);
// }, 10000);

module.exports = {
  processTweet
};
