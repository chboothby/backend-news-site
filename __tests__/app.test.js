// process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

describe("/api", () => {
  afterAll(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  test("Returns 404 if passed invalid path", () => {
    const methods = ["get", "post", "delete", "patch"];
    const requestPromises = methods.map((method) => {
      return request(app)
        [method]("/nonExistentURL")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    return Promise.all(requestPromises);
  });
  /********************* TOPICS ********************/
  describe("/topics", () => {
    test("GET topics responds with all the topics in the database", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual(expect.any(Array));
          expect(topics.length).toBe(3);
        });
    });
  });
  /********************* USERS ********************/
  describe("/users", () => {
    test("GET users by username responds with a user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual(expect.any(Object));
        });
    });
    test("GET users by username's object has the expected keys", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(Object.keys(user)).toEqual(["username", "name", "avatar_url"]);
        });
    });
    test("404 - user not found", () => {
      return request(app)
        .get("/api/users/not_a_user")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User not found");
        });
    });
  });
  /********************* ARTICLES ********************/
  describe("/articles", () => {
    test("GET article by article id responds with an article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(expect.any(Object));
        });
    });
    test("GET article by article id contains the expected keys", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(Object.keys(article)).toEqual([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count",
          ]);
        });
    });
  });
  /********************* COMMENTS ********************/
});
