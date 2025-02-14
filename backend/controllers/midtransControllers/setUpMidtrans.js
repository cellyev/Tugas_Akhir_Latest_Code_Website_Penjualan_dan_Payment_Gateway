const midtransClient = require("midtrans-client");

exports.snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: `${process.env.MIDTRANS_SERVER_KEY}`,
  clientKey: `${process.env.MIDTRANS_CLIENT_KEY}`,
});
