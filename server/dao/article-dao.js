const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const articleFolderPath = path.join(__dirname, "storage", "articleList");

// get an article
function get(articleId) {
  try {
    const filePath = path.join(articleFolderPath, `${articleId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadArticle", message: error.message };
  }
}

// create article
function create(article) {
  try {
    article.id = crypto.randomBytes(16).toString("hex");
    article.createdDate = new Date().toISOString();
    const filePath = path.join(articleFolderPath, `${article.id}.json`);
    const fileData = JSON.stringify(article);
    fs.writeFileSync(filePath, fileData, "utf8");
    return article;
  } catch (error) {
    throw { code: "failedToCreateArticle", message: error.message };
  }
}

// update article
function update(article) {
  try {
    const currentArticle = get(article.id);
    if (!currentArticle) return null;
    const newArticle = { ...currentArticle, ...article };
    const filePath = path.join(articleFolderPath, `${article.id}.json`);
    const fileData = JSON.stringify(newArticle);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newArticle;
  } catch (error) {
    throw { code: "failedToUpdateArticle", message: error.message };
  }
}

// remove an article
function remove(articleId) {
  try {
    const filePath = path.join(articleFolderPath, `${articleId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveArticle", message: error.message };
  }
}

// list articles, optionally filtered by topicId or keyword
function list(filter = {}) {
  try {
    if (!fs.existsSync(articleFolderPath)) return [];
    const files = fs
      .readdirSync(articleFolderPath)
      .filter((f) => f.endsWith(".json"));
    let articleList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(articleFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });

    // optional filter by topicId
    if (filter.topicId) {
      articleList = articleList.filter(
        (item) => item.topicId === filter.topicId
      );
    }

    // optional keyword filter
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      articleList = articleList.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.content && item.content.toLowerCase().includes(q))
      );
    }

    // newest first
    articleList.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

    return articleList;
  } catch (error) {
    throw { code: "failedToListArticles", message: error.message };
  }
}

// Helper
function listByTopicId(topicId) {
  return list({ topicId });
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByTopicId,
};
