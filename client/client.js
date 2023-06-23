const fetch = require('request-promise-native');
const protocol = process.env.PROTOCOL || 'https';
const ipAddress = process.env.IP_ADDRESS || '10.254.1.51';
const port = parseInt(process.env.PORT) || 443;
const path = process.env.REQUEST_PATH || '/sleep';
const host = process.env.HOST || 'modsecurity.test.dev'
const count = parseInt(process.env.COUNT) || 1;
const debug = process.env.DEBUG || false;

for (let i=0;i<count;i++) {
  console.log(`[${i+1}] send request`);
  sendRequest(i);
}

function sendRequest(index) {
  fetch({
    uri: `${protocol}://${ipAddress}:${port}${path}`,
    method: 'GET',
    headers: {
      'Host': `${host}`
    }
  })
  .then(res=>{
    if (debug) {
      console.log(res);
    }
    console.log(`[${index+1}] request ended..`)
  })
  .catch(err=>{
    console.error(err.error);
  })
}
