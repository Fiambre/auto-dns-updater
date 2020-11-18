//@ts-check
const freeDNS = require("./dns_provider/freedns.afraid");
const cloudflare = require("./dns_provider/cloudflare");

var providers = Array();

if(process.env.FREEDNS_TOKEN){
    providers.push(freeDNS);
}

if(process.env.CLOUDFLARE_API_KEY){
    providers.push(cloudflare);
}

module.exports.updateDns = (ip) => {
    providers.forEach(provider => provider(ip));
}