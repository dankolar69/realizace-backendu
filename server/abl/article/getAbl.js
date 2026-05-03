const Ajv = require("ajv");
const ajv = new Ajv();

const articleDao = require("../../dao/article-dao.js");
const topicDao = require("../../dao/topic-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const reqParams = req.query?.id ? req.query : req.body;

    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const article = articleDao.get(reqParams.id);
    if (!article) {
      res.status(404).json({
        code: "articleNotFound",
        message: `Article ${reqParams.id} not found`,
      });
      return;
    }

    // attach related topic
    const topic = topicDao.get(article.topicId);
    article.topic = topic;

    res.json(article);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
