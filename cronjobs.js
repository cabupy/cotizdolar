const CronJob = require("cron").CronJob;
const { processTweet } = require("./modules/twitter");

const main = () => {
  setTimeout(() => {
    processTweet(`compra`);
  }, 5000);

  setTimeout(() => {
    processTweet(`venta`);
  }, 10000);
};

new CronJob(
  "00 00 9,11,13,15,17 * * 1-5",
  main,
  null,
  true,
  "America/Asuncion"
);
