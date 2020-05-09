// upload;

// client.useBucket('Your bucket name');

async function put() {
    try {
        let result = await client.put('object-name', 'local file');
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

// module.exports = put;
