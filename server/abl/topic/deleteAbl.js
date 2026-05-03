const Ajv = require("ajv");
const ajv = new Ajv();

const topicDao = require("../../dao/topic-dao.js");
const articleDao = require("../../dao/article-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // do not allow deleting a topic that still has articles
    const articlesUnderTopic = articleDao.listByTopicId(reqParams.id);
    if (articlesUnderTopic.length > 0) {
      res.status(400).json({
        code: "topicNotEmpty",
        message: `Topic ${reqParams.id} still has ${articlesUnderTopic.length} article(s) and cannot be deleted`,
      });
      return;
    }

    topicDao.remove(reqParams.id);

    res.json({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
