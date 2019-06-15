const { 
  processTweet, 
  processTweetRef 
} = require("./modules/twitter");

const main = async () => {
  await processTweet(`compra`);
  await processTweet(`venta`);
  await processTweetRef(`venta`);
};

main();
