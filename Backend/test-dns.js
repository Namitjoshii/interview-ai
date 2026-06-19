const dns = require("dns");

console.log("Before:", dns.getServers());

dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log("After:", dns.getServers());

dns.resolveSrv(
  "_mongodb._tcp.interview-ai-cluster.jhx4kxc.mongodb.net",
  (err, records) => {
    console.log("ERR =", err);
    console.log("RECORDS =", records);
  }
);