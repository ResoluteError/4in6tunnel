/**
 * Hello world express app to test reachability of ports 8080 and 8443
 */
const express = require("express");
const app = express();
const httpPort = 8080;
const httpsPort = 8443;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(httpPort, () => {
  console.log(`Example app listening at http://localhost:${httpPort}`);
});

app.listen(httpsPort, () => {
  console.log(`Example app listening at http://localhost:${httpsPort}`);
});
