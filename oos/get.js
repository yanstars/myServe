async function get () {
    try {
      let result = await client.get('object-name');
      console.log(result);
    } catch (err) {
      console.log (err);
    }
  }
  
  get();
      