const path = require("path");
const Twit = require("twit");
const moment = require("moment");
// upload de env vars from .env file
require("dotenv").config({ path: path.join(__dirname, "/../.env") });
const db = require("../db");

const { processData } = require("./insertdb");

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
        AND a.entidad not in ('set', 'bcp')
	      AND a.fecha_hora::date = current_date
      ORDER BY a.entidad, b.fecha_hora DESC) c
      ORDER BY ${field} ${field == "venta" ? "ASC" : "DESC"}`);
    return rows;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const getRefBy = async field => {
  try {
    const rows = await db.query(`SELECT c.* FROM (
      SELECT DISTINCT ON (a.entidad) a.*
      FROM public.cotizaciones a
      INNER JOIN public.cotizaciones b ON a.id=b.id 
        AND a.entidad in ('set', 'bcp')
	      AND a.fecha_hora::date = current_date
      ORDER BY a.entidad, b.fecha_hora DESC) c
      ORDER BY ${field} ${field == "venta" ? "ASC" : "DESC"}`);
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
    rows.map((row, i) => {
      cadenaTweet += `${row.compra} | ${row.venta} | ${row.entidad}${
        rows.length == i + 1 ? "" : "\n"
      }`;
    });
    resolve(cadenaTweet);
  });
};

const processTweetRef = async (mode) => {
  let cadenaTweet = ``;
  try {
    const rowsBS = await getRefBy(mode);
    if (rowsBS.length > 0) {
      cadenaTweet = await makeTextTweet(
        rowsBS,
        `⏳ ${ahora} 🏦 SET y BCP:\n`
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
      `Error al buscar la cotizacion de referencia: Error: ${error.message}`
    );
  }
};

const processTweet = async mode => {
  let cadenaTweet = ``;
  try {
    // only if mode is equal compra, on venta select database direct ..
    if (mode === "compra") {
      const insertDB = await processData();
      if (!insertDB) {
        console.log(`insertDB, No se proceso correctamente el processData().`);
      }
    }

    const rowsBS = await getBestBy(mode);
    if (rowsBS.length > 0) {
      cadenaTweet = await makeTextTweet(
        rowsBS,
        `⏳ ${ahora} Orden 👌 ${capitalize(mode)}:\n`
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
  processTweet,
  processTweetRef
};
