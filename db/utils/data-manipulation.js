// extract any functions you are using to manipulate your data, into this file
exports.formatDateAndTime = (data) => {
  // take created_at key and change it to correct format yyyy-mm-dd hh:mm:ss
  return data.map(({ created_at, ...restOfData }) => {
    const date = new Date(created_at).toLocaleString();
    const dateArr = date.split("/");
    const year = dateArr[2].substr(0, 4);
    let day = dateArr[1];
    if (day < 10) day = `0${day}`;
    let month = dateArr[0];
    if (month < 10) month = `0${month}`;

    const time = dateArr[2].substr(6);

    const formattedDate = `${year}-${month}-${day} ${time}`;

    return {
      ...restOfData,
      created_at: formattedDate,
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
