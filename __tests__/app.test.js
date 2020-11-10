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
    describe("GET", () => {
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
            expect(Object.keys(user)).toEqual([
              "username",
              "name",
              "avatar_url",
            ]);
          });
      });
    });
    describe("Error handling", () => {
      test("404 - user not found", () => {
        return request(app)
          .get("/api/users/not_a_user")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User not found");
          });
      });
    });
  });
  /********************* ARTICLES ********************/
  describe("/articles", () => {
    describe("GET", () => {
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
    describe("PATCH", () => {
      test("PATCH article returns an article object", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual(expect.any(Object));
          });
      });
      test("PATCH article returns an article object with expected keys", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 10 })
          .expect(201)
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
      test("PATCH article returns an article object with the vote count incremented by input amount", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 10 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article.votes).toBe(10);
          });
      });
    });
    describe("Error handling", () => {
      test("404 - article not found", () => {
        return request(app)
          .get("/api/articles/300")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
          });
      });
      test("400 - bad request, not a valid id", () => {
        return request(app)
          .get("/api/articles/notAnId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("400 - bad request, invalid patch request", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ notAProperty: 7 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid patch request");
          });
      });
      test("400 - bad request, incorrect data type for patch request", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: "NaN" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
  });
  /********************* COMMENTS ********************/
});
