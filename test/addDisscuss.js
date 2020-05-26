const Discusssion = require('../model/discuss');

let discussion = new Discusssion(00000022, 00000023, 0000000000000036);

discussion.addToDb('你说啥呢?');
