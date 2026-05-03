const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const topicDao = require("../../dao/topic-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 50 },
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let topic = req.body;

    // validate input
    const valid = ajv.validate(schema, topic);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store topic to persistent storage
    topic = topicDao.create(topic);

    res.json(topic);
  } catch (e) {
    if (e.code === "uniqueNameAlreadyExists") {
      res.status(400).json({ code: e.code, message: e.message });
      return;
    }
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
