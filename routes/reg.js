var express = require('express');
var router = express.Router();

const Db = require("../utils/Db");

// 获取
router.post('/getReg', async (req, res) => {
    let { page, size, name } = req['body'];
    let regList = [];
    let total = "";
    if (name) {
        regList = await Db.select(req, `SELECT * FROM regList rl WHERE rl.name = ${name}  LIKE '%${name}%' LIMIT ${(page - 1) * size},${size}`);
        total = await Db.select(req, `select count(*) as total from regList  WHERE regList.name  LIKE '%${name}%'`);
    } else {
        regList = await Db.select(req, `SELECT * FROM regList  LIMIT ${(page - 1) * size},${size}`);
        total = await Db.select(req, `select count(*) as total from regList`);
    }
    if (regList.length !== 0) {
        res.send({
            code: 0,
            total: total[0].total,
            data: regList,
            msg: "获取成功"
        })
    } else {
        res.send({
            code: 500,
            data: [],
            total: total[0].total,
            msg: "查找为空"
        })
    }
})


module.exports = router;