const { add, deleteD, getList } = require('../controller/discuss');

class Discusssion {
    constructor(id = 0, targetId = 0, prodid = 0) {
        this.id = id;
        this.targetId = targetId;
        this.prodid = prodid;
    }

    async addToDb(uid, uname, pid, pname, prodid, text = '', date) {
        return await add(uid, uname, pid, pname, prodid, text, date);
    }

    async getDiscuss(id) {
        return await getList(id);
    }
    async deleteFromDb(id) {
        return await deleteD(id);
    }
}

module.exports = Discusssion;
