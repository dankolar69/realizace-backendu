const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const articleDao = require("../../dao/article-dao.js");
const topicDao = require("../../dao/topic-dao.js");

const schema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 150 },
    content: { type: "string", minLength: 1 },
    authorName: { type: "string", minLength: 1, maxLength: 100 },
    imageUrl: { type: "string", format: "uri" },
    topicId: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["title", "content", "authorName", "topicId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let article = req.body;

    // validate input
    const valid = ajv.validate(schema, article);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check that the referenced topic exists
    const topic = topicDao.get(article.topicId);
    if (!topic) {
      res.status(400).json({
        code: "topicDoesNotExist",
        message: `Topic with id ${article.topicId} does not exist`,
      });
      return;
    }

    // store article
    article = articleDao.create(article);
    article.topic = topic;

    res.json(article);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
