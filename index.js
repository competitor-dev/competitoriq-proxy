const https = require("https");

const handler = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.end();

  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    const options = {
      hostname: "api.localfalcon.com",
      path: req.url,
      method: req.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      }
    };

    const proxy = https.request(options, lfRes => {
      res.writeHead(lfRes.statusCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      lfRes.pipe(res);
    });

    proxy.on("error", e => res.end(JSON.stringify({ error: e.message })));
    proxy.write(body);
    proxy.end();
  });
};

module.exports = handler;
