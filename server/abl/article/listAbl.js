const Ajv = require("ajv");
const ajv = new Ajv();

const articleDao = require("../../dao/article-dao.js");
const topicDao = require("../../dao/topic-dao.js");

const schema = {
  type: "object",
  properties: {
    topicId: { type: "string", minLength: 32, maxLength: 32 },
    searchQuery: { type: "string", maxLength: 100 },
  },
  required: [],
  additionalProperties: false,
};

async function ListAbl(req, res) {
  try {
    const filter = Object.keys(req.query).length > 0 ? req.query : req.body;

    const valid = ajv.validate(schema, filter);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const articleList = articleDao.list(filter);
    const topicMap = topicDao.getTopicMap();

    res.json({ itemList: articleList, topicMap });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
