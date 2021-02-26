/**
 * Run the 6tunnel commands on the received IPv6 address
 */
const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();
const port = 8081;
const user = process.env.IP_MAPPER_USER || "ADMIN";
const password = process.env.IP_MAPPER_PASS || "ROOT";
const {exec} = require("child_process");

const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;

let users = {};
users[user] = password;

app.use(
  basicAuth({
    users,
  })
);

app.get("/mappings", (req, res) => {
  exec(`ps aux | grep 6tunnel`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`ERROR! Getting mappings FAILED: ${error}`).end();
      return;
    }
    if (stderr) {
      res.status(500).send(`ERROR! Getting mappings FAILED: ${stderr}`).end();
      return;
    }
    res.status(200).send(stdout).end();
  });
});

app.post("/mappings/:IPv6", (req, res) => {
  const IPv6 = req.params.IPv6;

  if (!IPv6 || !ipv6Regex.test(IPv6)) {
    return res
      .status(400)
      .send(`ERROR! Provided IP address is not IPv6: '${IPv6}'`)
      .end();
  }

  exec(
    `killall 6tunnel && 6tunnel 8080 ${IPv6} 8080 && 6tunnel 8443 ${IPv6} 8443 && 6tunnel 8022 ${IPv6} 22`,
    (error, _, stderr) => {
      if (error) {
        res.status(500).send(`ERROR! IPv6 update FAILED: ${error}`).end();
        return;
      }
      if (stderr) {
        res.status(500).send(`ERROR! IPv6 update FAILED: ${stderr}`).end();
        return;
      }
      res.status(201).send(`IPv6 Updated: ${IPv6}`).end();
    }
  );
});

app.listen(port, () => {
  console.log(`Dynamic IP mapper listening at http://localhost:${port}`);
});
