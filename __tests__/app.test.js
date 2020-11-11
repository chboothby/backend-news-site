// process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const sorted = require("jest-sorted");
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
      test("GET ALL articles responds with an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual(expect.any(Object));
          });
      });
      test("GET ALL articles' objects have the expected keys", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Object.keys(articles[0])).toEqual([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            ]);
            expect(articles[0].comment_count).toEqual("13");
          });
      });
      test("GET ALL articles accepts sort_by query which defaults to date, desc", () => {
        return request(app)
          .get(`/api/articles`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("GET ALL articles accepts sort_by query", () => {
        const queries = ["author", "topic", "title"];
        const promiseArr = queries.map((query) => {
          return request(app)
            .get(`/api/articles?sort_by=${query}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy(query, { descending: true });
            });
        });
        return Promise.all(promiseArr);
      });
      test("GET ALL articles accepts order query", () => {
        const queries = ["asc", "desc"];
        const promiseArr = queries.map((query) => {
          let order = "";
          if (query === "desc") {
            order = { descending: true };
          }

          return request(app)
            .get(`/api/articles?sort_by=author&order=${query}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("author", order);
            });
        });
        return Promise.all(promiseArr);
      });
      test("GET ALL articles accepts an author filter which filters all articles by selected username", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(6);
            expect(articles[0].author).toBe("icellusedkars");
          });
      });
      test("GET ALL articles accepts topic filter which filters all articles by selected topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(11);
            expect(articles[0].topic).toBe("mitch");
          });
      });
      test("GET article by article ID responds with an article object", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(expect.any(Object));
          });
      });
      test("GET article by article ID contains the expected keys", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(Object.keys(article)).toEqual([
              "article_id",
              "title",
              "author",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count",
            ]);
            expect(article.comment_count).toBe("0");
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
              "article_id",
              "title",
              "author",
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
    describe("/comments", () => {
      describe("GET", () => {
        test("GET all comments responds with an a comments object with a key containing an array of comments", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(Array.isArray(comments)).toBe(true);
            });
        });
        test("GET all comments responds with an array of objects containing the expected keys", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(Object.keys(comments[0])).toEqual([
                "comment_id",
                "author",
                "votes",
                "created_at",
                "body",
              ]);
            });
        });
        test("GET all comments accepts sort_by query which is set to created_by as default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("created_at");
            });
        });
        test("GET all comments accepts a sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("author");
            });
        });
        test("GET all comments accepts an order query which can be set to asc or desc", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author&order=desc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("author", { descending: true });
            });
        });
      });

      describe("POST", () => {
        test("POST comment responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({ username: "lurker", body: "Terrible article" })
            .expect(201);
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
      test("400 - bad request, missing data from comment post request", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Incomplete request");
          });
      });
      test("404 no articles found when trying to filter by non-existent author", () => {
        return request(app)
          .get("/api/articles?author=notAUser")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No articles found");
          });
      });
      test.only("404 no articles found when trying to filter by non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=notATopic")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No articles found");
          });
      });
    });
  });
  /********************* COMMENTS ********************/
});
