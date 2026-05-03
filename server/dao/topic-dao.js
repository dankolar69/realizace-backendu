const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const topicFolderPath = path.join(__dirname, "storage", "topicList");

// get topic
function get(topicId) {
  try {
    const filePath = path.join(topicFolderPath, `${topicId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTopic", message: error.message };
  }
}

// create topic
function create(topic) {
  try {
    const topicList = list();
    if (topicList.some((item) => item.name === topic.name)) {
      throw {
        code: "uniqueNameAlreadyExists",
        message: "Topic with given name already exists",
      };
    }
    topic.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(topicFolderPath, `${topic.id}.json`);
    const fileData = JSON.stringify(topic);
    fs.writeFileSync(filePath, fileData, "utf8");
    return topic;
  } catch (error) {
    if (error.code === "uniqueNameAlreadyExists") throw error;
    throw { code: "failedToCreateTopic", message: error.message };
  }
}

// update topic
function update(topic) {
  try {
    const currentTopic = get(topic.id);
    if (!currentTopic) return null;

    if (topic.name && topic.name !== currentTopic.name) {
      const topicList = list();
      if (topicList.some((item) => item.name === topic.name)) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "Topic with given name already exists",
        };
      }
    }

    const newTopic = { ...currentTopic, ...topic };
    const filePath = path.join(topicFolderPath, `${topic.id}.json`);
    const fileData = JSON.stringify(newTopic);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newTopic;
  } catch (error) {
    if (error.code === "uniqueNameAlreadyExists") throw error;
    throw { code: "failedToUpdateTopic", message: error.message };
  }
}

// remove a topic
function remove(topicId) {
  try {
    const filePath = path.join(topicFolderPath, `${topicId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveTopic", message: error.message };
  }
}

// list topics
function list() {
  try {
    if (!fs.existsSync(topicFolderPath)) return [];
    const files = fs
      .readdirSync(topicFolderPath)
      .filter((f) => f.endsWith(".json"));
    const topicList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(topicFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    topicList.sort((a, b) => a.name.localeCompare(b.name));
    return topicList;
  } catch (error) {
    throw { code: "failedToListTopics", message: error.message };
  }
}

// returns map of topicId -> topic for fast lookup
function getTopicMap() {
  const topicMap = {};
  const topicList = list();
  topicList.forEach((topic) => {
    topicMap[topic.id] = topic;
  });
  return topicMap;
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getTopicMap,
};
