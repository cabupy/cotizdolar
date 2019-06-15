const { processTweet } = require("./modules/twitter");

const main = () => {
  setTimeout(() => {
    processTweet(`compra`);
  }, 5000);

  setTimeout(() => {
    processTweet(`venta`);
  }, 10000);
};

main();