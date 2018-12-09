const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    imgId: {
      type: String,
      required: false,
      default: null
    },
    tags: {
      type: Array,
      required: true
    },
    pointsTotal: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);

const Article = (module.exports = mongoose.model('Article', ArticleSchema));

module.exports.saveArticle = (article, callback) => {
  article.save(callback);
};

module.exports.saveEditedArticle = (article, callback) => {
  const query = { _id: article._id };
  Article.findByIdAndUpdate(query, article, { new: true }, callback);
};

module.exports.getArticlesByUser = (username, callback) => {
  const query = { username: username };
  Article.find(query, callback);
};

module.exports.getAllArticles = callback => {
  Article.find()
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.removeArticles = (deletedArticles, callback) => {
  const query = { _id: { $in: deletedArticles } };
  Article.remove(query, callback);
};

module.exports.incrementPointTotal = (id, value) => {
  const query = { _id: id };
  Article.findByIdAndUpdate(query, { $inc: { pointsTotal: value } }).exec();
};
