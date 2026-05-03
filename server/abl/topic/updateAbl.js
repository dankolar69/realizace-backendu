const Ajv = require("ajv");
const ajv = new Ajv();

const topicDao = require("../../dao/topic-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 1, maxLength: 50 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const topic = req.body;

    const valid = ajv.validate(schema, topic);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedTopic = topicDao.update(topic);
    if (!updatedTopic) {
      res.status(404).json({
        code: "topicNotFound",
        message: `Topic ${topic.id} not found`,
      });
      return;
    }

    res.json(updatedTopic);
  } catch (e) {
    if (e.code === "uniqueNameAlreadyExists") {
      res.status(400).json({ code: e.code, message: e.message });
      return;
    }
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
