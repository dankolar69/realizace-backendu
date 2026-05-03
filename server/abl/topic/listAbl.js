const topicDao = require("../../dao/topic-dao.js");

async function ListAbl(req, res) {
  try {
    const topicList = topicDao.list();
    res.json({ itemList: topicList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
