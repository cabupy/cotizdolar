const CronJob = require("cron").CronJob;
const { 
  processTweet, 
  processTweetRef 
} = require("./modules/twitter");

const main = () => {
  await processTweet(`compra`);
  await processTweet(`venta`);
  await processTweetRef(`venta`);
};

new CronJob(
  "00 00 9,11,13,15,17 * * 1-5",
  main,
  null,
  true,
  "America/Asuncion"
);
