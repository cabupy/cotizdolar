const db = require("../db");
const mc = require("./scraping");
const _ = require("lodash");

const getCotizaciones = async () => {
  let cotizaciones = [];

  const alberdi = await mc.getAlberdi();
  //console.log(alberdi);
  cotizaciones.push({
    casa: "alberdi",
    compra: alberdi[1],
    venta: alberdi[2]
  });

  const basa = await mc.getBASA();
  //console.log(basa);
  cotizaciones.push({
    casa: "basa",
    compra: basa[1],
    venta: basa[2]
  });

  const bbva = await mc.getBBVA();
  //console.log(bbva);
  cotizaciones.push({
    casa: "bbva",
    compra: bbva[1],
    venta: bbva[2]
  });

  const bcp = await mc.getBCP();
  //console.log(bcp);
  cotizaciones.push({
    casa: "bcp",
    compra: _.toInteger(bcp[1]),
    venta: _.toInteger(bcp[2])
  });

  const bnf = await mc.getBNF();
  //console.log(bnf);
  cotizaciones.push({
    casa: "bnf",
    compra: _.toInteger(bnf[1]),
    venta: _.toInteger(bnf[2])
  });

  const chaco = await mc.getChaco();
  //console.log(chaco);
  cotizaciones.push({
    casa: "chaco",
    compra: chaco[1],
    venta: chaco[2]
  });

  const euro = await mc.getEURO();
  //console.log(euro);
  cotizaciones.push({
    casa: "euro",
    compra: euro[1],
    venta: euro[2]
  });

  const familiar = await mc.getFamiliar();
  //console.log(familiar);
  cotizaciones.push({
    casa: "familiar",
    compra: familiar[1],
    venta: familiar[2]
  });

  const fe = await mc.getFe();
  //console.log(fe);
  cotizaciones.push({
    casa: "fe",
    compra: fe[1],
    venta: fe[2]
  });

  const interfisa = await mc.getInterfisa();
  //console.log(interfisa);
  cotizaciones.push({
    casa: "interfisa",
    compra: interfisa[1],
    venta: interfisa[2]
  });

  const maxicambios = await mc.getMaxicambios();
  //console.log(maxicambios);
  cotizaciones.push({
    casa: "maxicambios",
    compra: maxicambios[1],
    venta: maxicambios[2]
  });

  const myd = await mc.getMyD();
  //console.log(myd);
  cotizaciones.push({
    casa: "myd",
    compra: myd[1],
    venta: myd[2]
  });

  const set = await mc.getSET();
  //console.log(set);
  cotizaciones.push({
    casa: "set",
    compra: set[1],
    venta: set[2]
  });

  const vision = await mc.getVision();
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
  // const alberdi = await mc.getAlberdi();
  // console.log(alberdi);
  // const basa = await mc.getBASA();
  // console.log(basa);
  // const bbva = await mc.getBBVA();
  // console.log(bbva);
  // const bcp = await mc.getBCP();
  // console.log(bcp);
  // const chaco = await mc.getChaco();
  // console.log(chaco);
  // const euro = await mc.getEURO();
  // console.log(euro);
  // const fe = await mc.getFe();
  // console.log(fe);
  // const familiar = await mc.getFamiliar();
  // console.log(familiar);
  // const interfisa = await mc.getInterfisa();
  // console.log(interfisa);
  // const maxicambios = await mc.getMaxicambios();
  // console.log(maxicambios);
  // const myd = await mc.getMyD();
  // console.log(myd);
  // const set = await mc.getSET();
  // console.log(set);
  // const vision = await mc.getVision();
  // console.log(vision);
};

const processData = async () => {
  let sqlINSERT = ``;

  const rows = await getCotizaciones();

  await rows.map((value, index) => {
    if (value.compra > 0 && value.venta > 0)
      sqlINSERT += `INSERT INTO public.cotizaciones ( entidad, moneda, compra, venta ) VALUES ( '${
        value.casa
      }', 'dolar', ${value.compra}, ${value.venta});\n`;
  });

  try {
    const result = await db.query(sqlINSERT);
    console.log(`Se insertaron ${result.length} registros.`);
    return true;
  } catch (error) {
    console.error(`Error al insertar en la BD. Mensaje: ${err.message}`);
    return false;
  }
};

// processData();

//main();

module.exports = {
  processData
};
