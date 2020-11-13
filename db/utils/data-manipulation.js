exports.formatDateAndTime = (data) => {
  return data.map(({ created_at, ...restOfData }) => {
    const date = new Date(created_at);
    return {
      ...restOfData,
      created_at: date,
    };
  });
};

exports.changeKeyToAuthor = (commentData) => {
  return commentData.map(({ created_by, ...restOfData }) => {
    return {
      ...restOfData,
      author: created_by,
    };
  });
};

exports.createArticleRef = (articleRows) => {
  const articleRef = {};
  articleRows.map(({ article_id, title }) => {
    articleRef[title] = article_id;
  });
  return articleRef;
};

exports.formatComments = (articleRef, commentData) => {
  return commentData.map(({ belongs_to, ...restOfData }) => {
    return { ...restOfData, article_id: articleRef[belongs_to] };
  });
};
