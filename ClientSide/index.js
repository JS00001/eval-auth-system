const request = require("request");
const crypto = require("crypto-js");
const config = require("./config.json");
const si = require("systeminformation");
const url = "http://localhost:80";
const fileName = "new";
let hwid;

auth()

function generate() {
    let gen = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!-)(.[]@";
    for (let x = 0; x < 20; x++) {
        gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return gen;
}

function spawnError(err, num) {
    console.log("[WARNING] Received error code (" + err + ") (Error Code #" + num + "). Please contact support.")
    process.exit()
}

async function auth() {
    await si.uuid().then(id => hwid = id.os.toString())
    let str = generate()
    request(url + "/auth?token=" + config.token + "&hwid=" + hwid + "&file=" + fileName + "&key=" + str, function (err, res, body) {
        //console.log(body)
        if (JSON.parse(body.split(" ")[0]).success == true) {
            let newBod = body.split(" ")[1];
            let toDES = crypto.TripleDES.decrypt(newBod, str);
            let rawDES = toDES.toString(crypto.enc.Utf8);
            let toAES = crypto.AES.decrypt(rawDES, str);
            let raw = toAES.toString(crypto.enc.Utf8);
            eval(raw);
        } else if (JSON.parse(body.split(" ")[0]).error == "ERR_QUERY") {
            spawnError("ERR_QUERY", "1")
        } else if (JSON.parse(body.split(" ")[0]).error == "ERR_FILE") {
            spawnError("ERR_FILE", "2")
        } else if (JSON.parse(body.split(" ")[0]).error == "ERR_ACCESS") {
            console.log("[AUTH] System auth failed. Please contact support if you feel this is a mistake. ")
            process.exit()
        }
    })
}
