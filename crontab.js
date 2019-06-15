const { processTweet } = require("./modules/twitter");

const main = () => {
  setTimeout(() => {
    processTweet(`compra`);
  }, 1000);

  setTimeout(() => {
    processTweet(`venta`);
  }, 11000);
};

main();