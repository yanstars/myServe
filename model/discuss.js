const { add, deleteD } = require('../controller/discuss');

class Discusssion {
    constructor(id = 0, targetId = 0, prodid = 0) {
        this.id = id;
        this.targetId = targetId;
        this.prodid = prodid;
    }

    async addToDb(text = '') {
        return await add(this.id, this.targetId, this.prodid, text);
    }

    async deleteFromDb(id) {
        return await deleteD(id);
    }
}

module.exports = Discusssion;
