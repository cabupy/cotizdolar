"use strict";

const r = require("request");
const cheerio = require("cheerio");
const moment = require("moment");
const _ = require("lodash");

const db = require("./db");

// alberdi
// basa
// bbva
// bcp
// chaco
// familiar
// fe
// interfisa
// maxicambios
// myd
// set
// vision

const op = {
  rejectUnauthorized: false,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000,
  url: null
};

// request and return body content as json
const rb = url => {
  return new Promise((resolve, reject) => {
    op.url = url;
    r(op, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const json_response = JSON.parse(response.body);
        resolve(json_response);
      } else {
        resolve([]);
      }
    });
  });
};

// request and return html object
const rh = url => {
  return new Promise((resolve, reject) => {
    op.url = url;
    r(op, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        resolve(html);
      } else {
        resolve("");
      }
    });
  });
};

const getAlberdi = async () => {
  try {
    const body = await rb(`http://cambiosalberdi.com/ws/getCotizaciones.json`);
    const compra = +body["asuncion"][0].compra
      .trim()
      .replace(".", "")
      .replace(",00", "");
    const venta = +body["asuncion"][0].venta
      .trim()
      .replace(".", "")
      .replace(",00", "");
    return ["alberdi", compra, venta];
  } catch (error) {
    //console.log(error.message);
    return ["alberdi", 0, 0];
  }
};

const getBASA = async () => {
  try {
    const body = await rb(
      `https://www.bancobasa.com.py/ebanking_ext/api/data/currency_exchange`
    );
    const compra = +body["currencyExchanges"][0].purchasePrice;
    const venta = +body["currencyExchanges"][0].salePrice;
    return ["basa", compra, venta];
  } catch (error) {
    return ["basa", 0, 0];
  }
};

const getBBVA = async () => {
  try {
    const body = await rb(
      `https://www.bbva.com.py/Yaguarete/public/quotations`
    );
    const compra = +body[0].cashBuyPrice;
    const venta = +body[0].cashSellPrice;
    return ["bbva", compra, venta];
  } catch (error) {
    return ["bbva", 0, 0];
  }
};

const getBCP = async () => {
  const url = `https://www.bcp.gov.py/webapps/web/cotizacion/referencial-fluctuante`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$("table > tbody > tr > td:nth-of-type(4)")[0]
      .children[0].data.trim()
      .replace(".", "")
      .replace(",", ".");
    const venta = +$("table > tbody > tr > td:nth-of-type(5)")[0]
      .children[0].data.trim()
      .replace(".", "")
      .replace(",", ".");

    return ["bcp", compra, venta];
  } catch (error) {
    return ["bcp", 0, 0];
  }
};

const getChaco = async () => {
  try {
    const body = await rb(
      `http://www.cambioschaco.com.py/api/branch_office/1/exchange`
    );
    const compra = +body["items"][0].purchasePrice;
    const venta = +body["items"][0].salePrice;
    return ["cambioschaco", compra, venta];
  } catch (error) {
    return ["cambioschaco", 0, 0];
  }
};

const getFamiliar = async () => {
  const url = `https://www.familiar.com.py/`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$("div#cotizacionesDesktop > div > hgroup > div > p")[1]
      .children[0].data.trim()
      .replace(".", "");
    const venta = +$("div#cotizacionesDesktop > div > hgroup > div > p")[3]
      .children[0].data.trim()
      .replace(".", "");
    return ["familiar", compra, venta];
  } catch (error) {
    return ["familiar", 0, 0];
  }
};

const getFe = async () => {
  const url = `http://www.fecambios.com.py/`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$("p.compra")[0]
      .children[0].data.trim()
      .replace(".", "")
      .replace(",", ".");
    const venta = +$("p.venta")[0]
      .children[0].data.trim()
      .replace(".", "")
      .replace(",", ".");
    return ["fe", compra, venta];
  } catch (error) {
    return ["fe", 0, 0];
  }
};

const getInterfisa = async () => {
  try {
    const body = await rb(`https://seguro.interfisa.com.py/rest/cotizaciones`);
    const monedas = body["operacionResponse"]["cotizaciones"]["monedaCot"];
    const compra = +_.find(monedas, { descripcion: "DOLARES AMERICANOS" })
      .compra;
    const venta = +_.find(monedas, { descripcion: "DOLARES AMERICANOS" }).venta;
    return ["interfisa", compra, venta];
  } catch (error) {
    return ["interfisa", 0, 0];
  }
};

const getMaxicambios = async () => {
  const hoy = moment(Date.now()).format("DDMMYYYY");
  try {
    const body = await rb(
      `http://www.maxicambios.com.py/Umbraco/api/Pizarra/Cotizaciones?fecha=${hoy}`
    );
    const compra = +body[0].Compra;
    const venta = +body[0].Venta;
    return ["maxicambios", compra, venta];
  } catch (error) {
    return ["maxicambios", 0, 0];
  }
};

const getMyD = async () => {
  const url = `https://www.mydcambios.com.py/`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$(
      "div.cambios-banner-text.scrollbox > ul:nth-of-type(2) > li:nth-of-type(2) "
    )[0].children[0].data;
    const venta = +$(
      "div.cambios-banner-text.scrollbox > ul:nth-of-type(2) > li:nth-of-type(3) "
    )[0].children[0].data;
    return ["myd", compra, venta];
  } catch (error) {
    return ["myd", 0, 0];
  }
};

const getSET = async () => {
  const url = `http://www.set.gov.py/portal/PARAGUAY-SET`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$("td.UICotizacion")[0]
      .children[0].data.trim()
      .replace("G. ", "")
      .replace(".", "");
    const venta = +$("td.UICotizacion")[1]
      .children[0].data.trim()
      .replace("G. ", "")
      .replace(".", "");
    return ["SET", compra, venta];
  } catch (error) {
    return ["SET", 0, 0];
  }
};

const getVision = async () => {
  const url = `https://www.visionbanco.com`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$(
      "table > tbody > tr > td:nth-of-type(2) > p:nth-of-type(1)"
    )[0]
      .children[0].data.trim()
      .replace(".", "");
    const venta = +$(
      "table > tbody > tr > td:nth-of-type(3) > p:nth-of-type(1)"
    )[0]
      .children[0].data.trim()
      .replace(".", "");
    return ["vision", compra, venta];
  } catch (error) {
    return ["vision", 0, 0];
  }
};

const getCotizaciones = async () => {
  let cotizaciones = [];

  const alberdi = await getAlberdi();
  //console.log(alberdi);
  cotizaciones.push({
    casa: "alberdi",
    compra: alberdi[1],
    venta: alberdi[2]
  });

  const basa = await getBASA();
  //console.log(basa);
  cotizaciones.push({
    casa: "basa",
    compra: basa[1],
    venta: basa[2]
  });

  const bbva = await getBBVA();
  //console.log(bbva);
  cotizaciones.push({
    casa: "bbva",
    compra: bbva[1],
    venta: bbva[2]
  });

  const bcp = await getBCP();
  //console.log(bcp);
  cotizaciones.push({
    casa: "bcp",
    compra: _.toInteger(bcp[1]),
    venta: _.toInteger(bcp[2])
  });

  const chaco = await getChaco();
  //console.log(chaco);
  cotizaciones.push({
    casa: "chaco",
    compra: chaco[1],
    venta: chaco[2]
  });

  const familiar = await getFamiliar();
  //console.log(familiar);
  cotizaciones.push({
    casa: "familiar",
    compra: familiar[1],
    venta: familiar[2]
  });

  const fe = await getFe();
  //console.log(fe);
  cotizaciones.push({
    casa: "fe",
    compra: fe[1],
    venta: fe[2]
  });

  const interfisa = await getInterfisa();
  //console.log(interfisa);
  cotizaciones.push({
    casa: "interfisa",
    compra: interfisa[1],
    venta: interfisa[2]
  });

  const maxicambios = await getMaxicambios();
  //console.log(maxicambios);
  cotizaciones.push({
    casa: "maxicambios",
    compra: maxicambios[1],
    venta: maxicambios[2]
  });

  const myd = await getMyD();
  //console.log(myd);
  cotizaciones.push({
    casa: "myd",
    compra: myd[1],
    venta: myd[2]
  });

  const set = await getSET();
  //console.log(set);
  cotizaciones.push({
    casa: "set",
    compra: set[1],
    venta: set[2]
  });

  const vision = await getVision();
  //console.log(vision);
  cotizaciones.push({
    casa: "vision",
    compra: vision[1],
    venta: vision[2]
  });

  // order asc by venta
  cotizaciones = _.sortBy(cotizaciones, ["venta"]);
  return cotizaciones;
};

const main = async () => {
  // const alberdi = await getAlberdi();
  // console.log(alberdi);

  // const basa = await getBASA();
  // console.log(basa);

  // const bbva = await getBBVA();
  // console.log(bbva);

  // const bcp = await getBCP();
  // console.log(bcp);

  // const chaco = await getChaco();
  // console.log(chaco);

  // const fe = await getFe();
  // console.log(fe);

  const familiar = await getFamiliar();
  console.log(familiar);

  // const interfisa = await getInterfisa();
  // console.log(interfisa);

  // const maxicambios = await getMaxicambios();
  // console.log(maxicambios);

  // const myd = await getMyD();
  // console.log(myd);

  // const set = await getSET();
  // console.log(set);

  // const vision = await getVision();
  // console.log(vision);
};

const insertDB = async json_values => {
  let sqlINSERT = ``;

  await json_values.map((value, index) => {
    sqlINSERT += `INSERT INTO public.cotizaciones ( entidad, moneda, compra, venta ) VALUES ( '${value.casa}', 'dolar', ${value.compra}, ${value.venta});\n`;
  });

  db.query(sqlINSERT)
    .then(result => console.log(result));
};

// main();
getCotizaciones().then(json_values => {
  insertDB(json_values);
});
