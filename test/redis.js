const redis = require('redis');
const { REDIS } = require('../conf');

const client = redis.createClient(REDIS.port, REDIS.host);

client.on('error', (err) => {
    console.error(err);
});

client.get('18382370489', (err, data) => {
    console.log('data', data);
});
