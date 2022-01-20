var express = require('express');
var router = express.Router();

const Db = require("../utils/Db");

// 获取
router.post('/getReg',async (req,res)=>{
    let { name } = req['body'];
    let regList = await Db.select(req, `SELECT * FROM regList rl WHERE rl.name  LIKE '%${name}%'`);
    res.send({
        code:0,
        data:regList
    })
})

// 添加
router.post("/addReg", async (req, res) => {
	let { userId,articleId } = {...req['body']}
    if (!userId || !articleId) {
        res.send(MError("缺少必要条件"));
	} else {
        let collectId = getUUID()
		let result = await Db.insert(req, 'collect_list', { userId,articleId,collectId });
        await Db.update(req,'article_list','articleCollect = articleCollect + 1',` WHERE articleId = '${articleId}'`)
		result ? res.send(Success('添加成功')) : res.send(MError('添加失败'));
	}
});

// 删除
router.post("/delReg", async (req, res) => {
	let { articleId,userId } = {...req['body']}
    if (!userId || !articleId) {
        res.send(MError("缺少必要条件"));
	} else {
		let result = await Db.delete(req, `DELETE FROM collect_list  WHERE userId = '${userId}' AND articleId = '${articleId}'`);
        await Db.update(req,'article_list','articleCollect = articleCollect - 1',` WHERE articleId = '${articleId}'`)
        result ? res.send(Success('取消收藏成功')) : res.send(MError('取消收藏失败'));
	}
});

module.exports = router;