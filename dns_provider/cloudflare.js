//@ts-check

const { default: Axios } = require("axios");
const psl = require("psl");

const config = {
    headers: { 
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY
    }
};

const CLOUDFLARE_SUBDOMAIN = process.env.CLOUDFLARE_SUBDOMAIN;
const CLOUDFLARE_ZONE = psl.get(CLOUDFLARE_SUBDOMAIN);


module.exports = async(ip) =>{

    console.log(`[CLOUDFLARE] Zone: ${CLOUDFLARE_ZONE} Dns: ${CLOUDFLARE_SUBDOMAIN}`);

    let zoneData = await Axios.get(`https://api.cloudflare.com/client/v4/zones?name=${CLOUDFLARE_ZONE}`, config);
    let zoneId = zoneData.data.result[0].id

    console.log(`[CLOUDFLARE] ZoneID: ${zoneId}`);

    let dnsData = await Axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${CLOUDFLARE_SUBDOMAIN}`, config);

    console.log(`[CLOUDFLARE] DNS ID: ${dnsData.data.result[0].id}`);

     let dnsId = dnsData.data.result[0].id;
     let dnsName = dnsData.data.result[0].name;
     let dnsTtl = dnsData.data.result[0].ttl;
     let dnsProxied = dnsData.data.result[0].proxied;

     let putData = { 
            'content' : ip,
            'type' : 'A',
            'name' : dnsName,
            'ttl' : dnsTtl,
            'proxied' : dnsProxied
        };

     let result = await Axios.put(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${dnsId}`,putData, config);

     if(result.data.success){
        console.log(`[CLOUDFLARE] DNS Updated`);
     }else{
        result.data.errors.forEach(e => console.log(`[CLOUDFLARE] ${e}`));
     }
};
