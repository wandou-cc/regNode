var express = require('express');
var router = express.Router();

const Db = require("../utils/Db");

// 获取
router.post('/getReg', async (req, res) => {
    let { page, size, name } = req['body'];
    let regList = [];
    if (name) {
        regList = await Db.select(req, `SELECT * FROM regList rl WHERE rl.name  LIKE '%${name}%' LIMIT ${(page - 1) * size},${size}`);
    } else {
        regList = await Db.select(req, `SELECT * FROM regList rl WHERE rl.name  LIMIT ${(page - 1) * size},${size}`);
    }

    let total = await Db.select(req, `select count(*) as total from regList`);

    if (regList.length !== 0) {
        res.send({
            code: 0,
            total:total[0].total,
            data: regList,
            msg: "获取成功"
        })
    } else {
        res.send({
            code: 500,
            data: [],
            total:total[0].total,
            msg: "查找为空"
        })
    }
})

// 添加
router.post("/addReg", async (req, res) => {
    let { name, value } = { ...req['body'] }
    if (!name || !value) {
        res.send(MError("缺少必要条件"));
    } else {
        let id = new Date().valueOf()
        let result = await Db.insert(req, 'regList', { id, name, value });
        if (result) {
            res.send({
                code: 0,
                data: result,
                msg: "添加成功"

            })
        } else {
            res.send({
                code: 500,
                data: '',
                msg: "添加失败"
            })
        }
    }
});

// 删除
router.post("/delReg", async (req, res) => {
    let { id } = { ...req['body'] }
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        let result = await Db.delete(req, `DELETE FROM regList  WHERE id = '${id}'`);
        if (result) {
            res.send({
                code: 0,
                data: result,
                msg: "删除成功"

            })
        } else {
            res.send({
                code: 500,
                data: '',
                msg: "删除失败"
            })
        }
    }
});

module.exports = router;