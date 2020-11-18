//@ts-check
const publicIp = require('public-ip');
const LocalStorage = require('node-localstorage').LocalStorage;
const cron = require('node-cron');
const providers = require('./providers');

var localStorage = new LocalStorage('./storage');

/**
 * Public IP Options
 */

var opts = {
    fallbackUrls: [
        'https://ifconfig.co/ip'
    ]
};

/**
 * CRON JOB SCHEDULE
 */

 const CRON_EXPRESSION = process.env.CRON_EXPRESSION || '* * * * *'; // Default every minute.

cron.schedule(CRON_EXPRESSION, async () =>{
    let previusIp = localStorage.getItem('previusIp');
	let ip = await publicIp.v4(opts);
    
    if(!previusIp || previusIp !== ip){
        console.log(`Update IP => ${ip}`);
        localStorage.setItem('previusIp', ip);
        providers.updateDns(ip);
    }else{
        console.log(`Nothing to do, same IP => ${ip}`);
    }
});


console.log(`[Auto DNS UPDATER Start]`);