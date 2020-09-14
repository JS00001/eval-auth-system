  // *************************************************
  // 
  //           Basic Eval Auth Example
  //             Made By: Jack S
  //      Please do not remove credits. Thanks!
  //
  // *************************************************
  const crypto = require("crypto-js");
  const express = require("express");
  const chalk = require("chalk");
  const sha = require("sha256");
  const fs = require("fs");
  const config = require("./config.json");
  const encrypt = require("./encrypt");
  const app = express();

  let password = config.password;
  let port = config.port;
  let errorQuery = "ERR_QUERY";
  let errorAccess = "ERR_ACCESS";
  let errorFile = "ERR_FILE";
  let d = chalk.hex("6776E7")("[INFO] ");
  let success = false;
  let logs = {
      success: 0,
      failed: 0,
      generateapi: 0,
      generatetoken: 0
  };
  let resData;
  let reqData;

  function generate() {
      let gen = "";
      let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let x = 0; x < 6; x++) {
          gen += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return gen;
  }

  function verifyData(bool) {
      if (bool) {
          logs.success++
          success = false;
          return resData.send("{\"success\":true} " + encrypt.funcEncrypt(fs.readFileSync("./Files/" + reqData.query.file + ".js", "utf8"), reqData.query.key));
      } else {
          logs.failed++
          return spawnError(errorAccess);
      }
  }


  function spawnError(reason) {
      resData.send({
          error: reason,
          success: false
      })
  }

  /*
      Authentication API
     Generate tokens, etc.
  */
  app.get("/api/genapikey", function (req, res) {
      resData = res;
      fs.readFile("./Data/apikeys.json", "utf8", function (err, data) {
          let fileData = JSON.parse(data);

          if (!req.query.auth) return spawnError(errorQuery);
          if (req.query.auth != password) return spawnError(errorAccess);

          let key = generate() + generate();
          fileData.push(sha(key))
          logs.generateapi++

          const toWrite = JSON.stringify(fileData, null, 2)
          fs.writeFileSync('./Data/apikeys.json', toWrite);
          return res.send({
              key: key,
              success: true
          })
      })
  })

  app.get("/api/genkey", function (req, res) {
      resData = res;
      fs.readFile("./Data/apikeys.json", "utf8", function (err, data) {
          let fileData = JSON.parse(data);
          fs.readFile("./Data/tokens.json", "utf8", function (err, datam) {
              let tokenData = JSON.parse(datam);

              if (!req.query.apikey || !req.query.identifier) return spawnError(errorQuery);
              let user = req.query.identifier;
              let key = req.query.apikey;

              if (fileData.includes(sha(key))) {
                  let newToken = generate() + "-" + generate() + "-" + generate() + "-" + generate();
                  let encrypt = sha(newToken);
                  let userencrypt = sha(user);

                  if (!tokenData[userencrypt]) {
                      tokenData[userencrypt] = {
                          tokens: [{
                              [encrypt]: {
                                  hwid: "none"
                              }
                          }]
                      }
                  } else {
                      tokenData[userencrypt].tokens.push({
                          [encrypt]: {
                              hwid: "none"
                          }
                      })
                  }

                  logs.generatetoken++
                  const toWrite = JSON.stringify(tokenData, null, 2)
                  fs.writeFileSync('./Data/tokens.json', toWrite);
                  return res.send({
                      token: newToken,
                      user: user,
                      success: true
                  })
              } else return spawnError(errorAccess)
          })
      })
  })

  app.get("/api/requests", function (req, res) {
      resData = res;
      fs.readFile("./Data/apikeys.json", "utf8", function (err, data) {
          let fileData = JSON.parse(data);
          if (fileData.includes(sha(req.query.apikey))) {
              if (!req.query.apikey) return spawnError(errorQuery);
              let output = {
                  success: logs.success,
                  failed: logs.failed,
                  generatedtokens: logs.generatetoken,
                  generatedapikeys: logs.generateapi
              }
              logs.success = 0;
              logs.failed = 0;
              logs.generatetoken = 0;
              logs.generateapi = 0
              return res.send(output);
          } else return spawnError(errorAccess)
      })
  })


  /*
      Authentication Functions
        Generate tokens, etc.
  */
  app.get("/auth", function (req, res) {
      resData = res;
      reqData = req;
      fs.readFile("./Data/tokens.json", "utf8", function (err, data) {
          let fileData = JSON.parse(data)
          if (!req.query.token && !req.query.file && !req.query.key && !req.query.hwid) return spawnError(errorQuery);
          if (!fs.existsSync("./Files/" + req.query.file + ".js")) return spawnError(errorFile);

          for (let x in fileData) {
              if (fileData[x].tokens.some(tokens => tokens[sha(req.query.token)])) {
                  fileData[x].tokens.forEach(token => {
                      for (let i in token) {
                          if (i == sha(req.query.token)) {
                              if (token[i].hwid == "none") {
                                  success = true;
                                  token[i].hwid = sha(req.query.hwid);
                                  const toWrite = JSON.stringify(fileData, null, 2)
                                  fs.writeFileSync('./Data/tokens.json', toWrite);
                              } else if (token[i].hwid == sha(req.query.hwid)) {
                                  success = true;
                              }
                          }
                      }
                  })
              }
          }
          verifyData(success);
      })

  })

  app.listen(port, async () => {
      if (config.cleanconsole) console.clear();
      console.log(d + "Now listening on localhost:" + port);
  })
