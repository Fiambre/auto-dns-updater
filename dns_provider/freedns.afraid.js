//@ts-check
const https = require("https");
const freeDnsToken = process.env.FREEDNS_TOKEN;

module.exports = function(ip){
    console.log(`[FREEDNS] Update start to ip ${ip}`);

    let req = https.get(freeDnsToken.startsWith("http") ? freeDnsToken : `https://freedns.afraid.org/dynamic/update.php?${freeDnsToken}`,res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => console.log(`[FREEDNS] ${data}`));
    });

    req.on('error', error =>  console.error(`[FREEDNS] ${error}`));
}