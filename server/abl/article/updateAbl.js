const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const articleDao = require("../../dao/article-dao.js");
const topicDao = require("../../dao/topic-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    title: { type: "string", minLength: 1, maxLength: 150 },
    content: { type: "string", minLength: 1 },
    authorName: { type: "string", minLength: 1, maxLength: 100 },
    imageUrl: { type: "string", format: "uri" },
    topicId: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const article = req.body;

    const valid = ajv.validate(schema, article);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check existence of article first
    const existing = articleDao.get(article.id);
    if (!existing) {
      res.status(404).json({
        code: "articleNotFound",
        message: `Article ${article.id} not found`,
      });
      return;
    }

    // if topicId is being changed, validate it exists
    if (article.topicId) {
      const topic = topicDao.get(article.topicId);
      if (!topic) {
        res.status(400).json({
          code: "topicDoesNotExist",
          message: `Topic with id ${article.topicId} does not exist`,
        });
        return;
      }
    }

    const updatedArticle = articleDao.update(article);

    // attach topic for convenience
    updatedArticle.topic = topicDao.get(updatedArticle.topicId);

    res.json(updatedArticle);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
