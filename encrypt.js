const crypto = require("crypto-js");
const config = require("./config.json");

class encrypt {
    static funcEncrypt(string, key) {
        let toAES = crypto.AES.encrypt(string, key).toString();
        let toDES = crypto.TripleDES.encrypt(toAES, key).toString();
        return toDES;
    }

    // static funcDecrypt(string, key) {
    //     let toDES = crypto.TripleDES.decrypt(string, key);
    //     let rawDES = toDES.toString(crypto.enc.Utf8);
    //     let toAES = crypto.AES.decrypt(rawDES, key);
    //     let raw = toAES.toString(crypto.enc.Utf8);
    //     return raw;
    // }

}
module.exports = encrypt;