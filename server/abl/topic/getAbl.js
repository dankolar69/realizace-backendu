const Ajv = require("ajv");
const ajv = new Ajv();

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

    const topic = topicDao.get(reqParams.id);
    if (!topic) {
      res.status(404).json({
        code: "topicNotFound",
        message: `Topic ${reqParams.id} not found`,
      });
      return;
    }

    res.json(topic);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
