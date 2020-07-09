"use strict";

const r = require("request");
const cheerio = require("cheerio");
const moment = require("moment");
const _ = require("lodash");

// alberdi ok .
// basa ok .
// bbva ok .
// bcp ok .
// bnf ok .
// chaco ok .
// eurocambios ok .
// familiar ok .
// fe ok .
// interfisa ok .
// maxicambios ok .
// myd ok .
// set ok .
// vision ok .

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

const rpb = url => {
  return new Promise((resolve, reject) => {
    r.post(
      {
        url: url,
        form: { param: "getCotizacionesbySucursal", sucursal: 1 }
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          const json_response = JSON.parse(response.body);
          resolve(json_response);
        } else {
          resolve([]);
        }
      }
    );
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

const getBNF = async () => {
  const url = `https://www.bnf.gov.py/`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$("table > tbody > tr > td.text-right")[0]
      .children[0].data
      .trim()
      .replace(".", "")
      .replace(",", ".");
    const venta = +$("table > tbody > tr > td.text-right")[1]
      .children[0].data
      .trim()
      .replace(".", "")
      .replace(",", ".");
    
    return ["bnf", compra, venta];
  } catch (error) {
    return ["bnf", 0, 0];
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

const getEURO = async () => {
  try {
    const body = await rpb(`https://eurocambios.com.py/v2/sgi/utilsDto.php`);
    const compra = +body[0].compra;
    const venta = +body[0].venta;
    return ["eurocambios", compra, venta];
  } catch (error) {
    console.log(error);
    return ["eurocambios", 0, 0];
  }
};

const getFamiliarOld = async () => {
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

const getFamiliar = async () => {
  const url = `https://www.familiar.com.py/`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$("#cotizaciones div div div div div strong")[0]
      .children[0].data.trim()
      .replace(".", "");
    const venta = +$("#cotizaciones div div div div div strong")[1]
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

const getMaxicambiosOld = async () => {
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

const getMaxicambios = async () => {
  const url = `https://www.maxicambios.com.py/`;
  try {
    const html = await rh(url);
    const $ = cheerio.load(html);
    const compra = +$(
      "#monedas div div div div div div div p"
    )[1].children[0].data.trim();
    const venta = +$(
      "#monedas div div div div div div div p"
    )[4].children[0].data.trim();
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
    const compra = +$("td.UICotizacion > p")[0]
      .children[0].data.trim()
      .replace("G. ", "")
      .replace(".", "");
    const venta = +$("td.UICotizacion > p")[1]
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

module.exports = {
  getAlberdi,
  getBASA,
  getBBVA,
  getBCP,
  getBNF,
  getChaco,
  getEURO,
  getFamiliar,
  getFe,
  getInterfisa,
  getMaxicambios,
  getMyD,
  getSET,
  getVision
};
