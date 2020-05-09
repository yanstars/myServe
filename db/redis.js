const redis = require('redis');
const { REDIS } = require('../conf');

const client = redis.createClient(REDIS.port, REDIS.host);

client.on('error', (err) => {
    console.error(err);
});

// client.doSet = async (key, value, time) => {
//     client.set(key, value, (err) => {
//         if (err) {
//             console.log('err', err);
//             throw err;
//         }
//         new Promise((res, rel) => {
//              client.expire(key, time);
//         });
//     });
// };

module.exports = client;
