# :newspaper: News Site API :newspaper:

API for a reddit-style news article site. Built with an express server using [Knex](https://knexjs.org) to interact with a postgreSQL database.

[Click here to view the hosted version of my API](https://backend-news-site.herokuapp.com/api). 

## Available Enpoints 

### /api
- Serves up a json representation of all the available endpoints of the api

### /api/topics
*GET*
- Serves an array of all topics
- Example response: 
```json
{
 "topics": [{
  "slug": "football", "description": "Footie!", 
  }]
}
```
    
*POST*
- Adds a new topic and responds with added topic
- Example request: ```{
      "slug": "topic_name",
      "description": "what the topic is about"
    }```
- Example response: 
```json
{
  "topic": {
    "slug": "topic_name",
    "description": "what the topic is about"
   }
} 
```
    
 
### /api/users
*GET*
- Responds with array of all user objects

*POST*
- Adds a new user and responds with added user
- Example request: ```{
      "name": "name-a",
      "username": "user-a"
    }```
- Example response: 
```json
{
  "user": {
    "name": "name-a",
    "username": "user-a",
    "avatar-url": "null"
  }
}
```

### /api/users/:username
*GET*
- Serves up an object with the given usernames data
- Example response: 
```json
{
  "user": {
    "username": "user_A",
    "name": "firstName",
    "avatar-url": "https://some-avatar-pic.png"
  }
}
````


### /api/articles
*GET*
- Serves an array of all topics
- Accepts queries:
⋅⋅- Filters: author, topic, limit, page
⋅⋅- Ordering: sort_by, order (asc/desc)
- Example response: 
```json
{
  "articles": [{
    "title": "Seafood substitutions are increasing",
    "topic": "cooking",
    "author": "weegembump",
    "body": "Text from the article..",
    "created_at": 1527695953341
  }]
}
```
    
*POST*
- Adds a new article and responds with the new article
- Request example: ```{
      "title": "New Article",
      "author": "author-id",
      "body": "article text here",
      "topic": "random-topic"
    }```

- Example response: 
```json
{
  "article": {
    "article_id": 13,
    "title": "New Article",
    "author": "author-id",
    "body": "article text here",
    "topic": "random-topic",
    "created_at": "2020-11-11T15:28:31.483Z",
    "votes": 0
  }
}
```
    
*DELETE*
- Deletes the article matching the given id and that articles comments
- Example response: 
```json
{
  "status": "204",
  "msg": "content not found"
}
```

*PATCH*
- Updates the votes on the article by a given amount
- Request example: ```{
      "inc_votes": 10
    }```
- Example response: 
```json
{
  "article": {
    "article_id": 1,
    "title": "article-title",
    "author": "author-name",
    "body": "Text from the article...",
    "topic": "random-topic",
    "created_at": 1527695953341,
    "votes": 10,
    "comment_count": 5
  }
}
```
    
### /api/artices/:article_id
*GET*
- Responds with an object containing the article matching the given article id
- Example response: 
```json
{
  "article": {
    "article_id": 1,
    "title": "article-title",
    "author": "author-name",
    "body": "Text from the article...",
    "topic": "random-topic",
    "created_at": 1527695953341,
    "votes": 10,
    "comment_count": 5
  }
}
```

*POST*
- Adds a new comment to the article matching the given article id, responds with the new comment
- Request example: ```{
      "username": "user_A",
      "body": "Text from the comment..."
    }```
- Example response: 
```json
{
  "comment": {
    "comment_id": 19,
    "author": "lurker",
    "article_id": 3,
    "votes": 0,
    "created_at": "2020-11-11T14:32:08.083Z",
    "body": "Text from the comment..."
  }
}
```

### /api/articles:article_id/comments
*GET*
- Responds with an array containing the comment objects associated with the given article id
- Accepted queries: sort_by, order, limit and page
- Example response: 
```json 
{
  "comments": [{
    "comment_id": 1,
    "author": "author-name",
    "votes": 4,
    "created_at": "2020-11-11T14:32:08.083Z",
    "body": "Text from the comment..."
  }]
}
```
    
*PATCH*
- Increments or decrements a comments votes by given amount and returns new comment object
- Request example: ```{
      "inc_votes": -1
    }```
- Example response: 
```json
{
  "comment": {
    "comment_id": 1,
    "author": "author-name",
    "votes": 4,
    "created_at": "2020-11-11T14:32:08.083Z",
    "body": "Text from the comment..."
  }
}
```

*DELETE*
- Deletes the comment with the given id
- Example response: 
```json
{
  "status": "204",
  "msg": "content not found"
}
```
